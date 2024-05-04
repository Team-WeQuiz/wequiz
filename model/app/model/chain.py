from model.prompt import CHOICE_PROB_TEMPLATE, SHORT_PROB_TEMPLATE
from model.schema import ChoiceOutput, ShortOutput
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain.chains import LLMChain
from langchain.chains.base import Chain
from langchain.schema import BaseRetriever
from typing import List, Dict, Any
from langchain.globals import set_debug

set_debug(True)

# Retrieval 체인
class RetrievalChain(Chain):
    retriever: BaseRetriever

    @property
    def input_keys(self) -> List[str]:
        return ["message"]

    @property
    def output_keys(self) -> List[str]:
        return ["context"]

    def _call(self, inputs: Dict[str, Any]) -> Dict[str, str]:
        message = inputs["message"]
        relevant_docs = self.retriever.invoke(message)
        context = " ".join([doc.page_content for doc in relevant_docs])
        return {"context": context}

# 문제 생성 체인
class QuizGenerationChain(Chain):
    prompt: PromptTemplate
    llm: ChatOpenAI
    output_parser: JsonOutputParser

    @property
    def input_keys(self) -> List[str]:
        return ["context"]

    @property
    def output_keys(self) -> List[str]:
        return ["quiz"]

    def _call(self, inputs: Dict[str, Any]) -> Dict[str, Any]:
        context = inputs["context"]
        return {"quiz": self.llm_chain.invoke(context)}

    @property
    def llm_chain(self) -> LLMChain:
        return LLMChain(
            prompt=self.prompt,
            llm=self.llm,
            output_parser=self.output_parser,
        )
    
# 문제 생성 클래스
class QuizPipeline:
    def __init__(self, indices: object):
        self.indices = indices
        self.retriever = self.indices.as_retriever(search_kwargs=dict(k=1))  # 인덱스 객체로부터 retriever 초기화
        self.llm = ChatOpenAI(model="gpt-3.5-turbo-0125")
        self.question_templates = [CHOICE_PROB_TEMPLATE, SHORT_PROB_TEMPLATE]
        self.output_schemas = [ChoiceOutput, ShortOutput]

    def generate_quiz(self, question_type: int, message: str) -> dict:
        parser = JsonOutputParser(pydantic_object=self.output_schemas[question_type])
        prompt = PromptTemplate(
            template=self.question_templates[question_type],
            input_variables=["context"],
            partial_variables={"format_instructions": parser.get_format_instructions()}
        )
        retrieval_chain = RetrievalChain(retriever=self.retriever)
        quiz_generation_chain = QuizGenerationChain(prompt=prompt, llm=self.llm, output_parser=parser)
        pipe = retrieval_chain | quiz_generation_chain
        return pipe.invoke({"message": message})
    
#######################################################################################################


from model.prompt import MAP_TEMPLATE, REDUCE_TEMPLATE
from langchain.chains.combine_documents.stuff import StuffDocumentsChain
from langchain.chains import ReduceDocumentsChain, MapReduceDocumentsChain
from langchain_core.output_parsers import StrOutputParser


class SummaryChain():
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-3.5-turbo-0125")

    # meta data generate, map reduce 방식으로 문서를 쪼개서 요약하고 합침.
    async def summary(self, split_docs):
        
        # map 
        map_prompt = PromptTemplate.from_template(MAP_TEMPLATE)
        map_chain = LLMChain(llm=self.llm, prompt=map_prompt)

        # reduce
        reduce_prompt = PromptTemplate.from_template(REDUCE_TEMPLATE)
        reduce_chain = LLMChain(llm=self.llm, prompt=reduce_prompt)

        # 문서의 목록을 받아들여, 이를 단일 문자열로 결합하고, 이를 LLMChain에 전달합니다.
        combine_documents_chain = StuffDocumentsChain(
            llm_chain=reduce_chain,                
            document_variable_name="docs" # Reduce 프롬프트에 대입되는 변수
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
            return_intermediate_steps=True,
        )

        output = await map_reduce_chain.ainvoke(split_docs)
        
        return output


#######################################################################################################


from model.prompt import MARK_TEMPLATE

class MarkChain():
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-3.5-turbo-0125")
    
    def mark(self, answer, user):
        prompt = PromptTemplate(
            template=MARK_TEMPLATE,
            input_variables=["answer", "user"],
        )

        chain = LLMChain(llm=self.llm, prompt=prompt)

        return chain.invoke({"answer": answer, "user": user})