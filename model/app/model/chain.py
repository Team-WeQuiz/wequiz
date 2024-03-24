from model.prompt import PROB_TEMPLATE, MAP_TEMPLATE, REDUCE_TEMPLATE
from model.schema import Output
from langchain_openai import OpenAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser, StrOutputParser
from langchain.memory import VectorStoreRetrieverMemory
from langchain_community.vectorstores import FAISS
from langchain.chains import LLMChain
from langchain.chains.combine_documents.stuff import StuffDocumentsChain
from langchain.chains import ReduceDocumentsChain, MapReduceDocumentsChain
from langchain_openai import OpenAIEmbeddings


# LLM 체인 클래스
class Chain():
    def __init__(self, indices, type, openai_api_key):
        # self.vectorstore= FAISS.load_local(db_path, embeddings=OpenAIEmbeddings(openai_api_key=openai_api_key))
        self.retriever = indices.as_retriever(search_kwargs=dict(k=3))
        self.llm = OpenAI(openai_api_key=openai_api_key)
    
    # LLM inference 함수
    def prob(self, message):
        parser = JsonOutputParser(pydantic_object=Output)
        prompt = PromptTemplate(
            template=PROB_TEMPLATE,
            input_variables=["message"],
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )
        memory = VectorStoreRetrieverMemory(retriever=self.retriever)
        chain = LLMChain(llm=self.llm, prompt=prompt, memory=memory, output_parser=parser)
        
        return chain.invoke(message)
    
    # meta data generate, map reduce 방식으로 문서를 쪼개서 요약하고 합침.
    def summary(self, split_docs):
        parser = StrOutputParser()
        
        # map 
        map_prompt = PromptTemplate.from_template(MAP_TEMPLATE)
        map_chain = LLMChain(llm=self.llm, prompt=map_prompt)

        # reduce
        reduce_prompt = PromptTemplate.from_template(REDUCE_TEMPLATE)
        reduce_chain = LLMChain(llm=self.llm, prompt=reduce_prompt)

        # 문서의 목록을 받아들여, 이를 단일 문자열로 결합하고, 이를 LLMChain에 전달합니다.
        combine_documents_chain = StuffDocumentsChain(
            llm_chain=reduce_chain,                
            document_variable_name="doc_summaries" # Reduce 프롬프트에 대입되는 변수
        )

        # Map 문서를 통합하고 순차적으로 Reduce합니다.
        reduce_documents_chain = ReduceDocumentsChain(
            # 호출되는 최종 체인입니다.
            combine_documents_chain=combine_documents_chain,
            # 문서가 `StuffDocumentsChain`의 컨텍스트를 초과하는 경우
            collapse_documents_chain=combine_documents_chain,
            # 문서를 그룹화할 때의 토큰 최대 개수입니다.
            token_max=4000,
        )

        # 문서들에 체인을 매핑하여 결합하고, 그 다음 결과들을 결합합니다.
        map_reduce_chain = MapReduceDocumentsChain(
            # Map 체인
            llm_chain=map_chain,
            # Reduce 체인
            reduce_documents_chain=reduce_documents_chain,
            # 문서를 넣을 llm_chain의 변수 이름(map_template 에 정의된 변수명)
            document_variable_name="pages",
            # 출력에서 매핑 단계의 결과를 반환합니다.
            return_intermediate_steps=False,
        )

        return map_reduce_chain.run(split_docs)
