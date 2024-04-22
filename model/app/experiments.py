import json
from utils.security import get_openai_api_key
from data.preprocessor import Parser
from langchain_openai import ChatOpenAI


OPENAI_API_KEY = json.loads(get_openai_api_key())["OPENAI_API_KEY"]
llm = ChatOpenAI(openai_api_key=OPENAI_API_KEY, model="gpt-3.5-turbo-0125")

parser = Parser(0)
split_docs = parser.parse()

text = """
이 문서는 인터넷에 대한 소프트웨어적, 하드웨어적 측면을 다루고 있습니다. 하드웨어적으로는 수백만 개의 연결된 컴퓨팅 장치와 데이터를 전달하는 Packet switches, 통신 링크에 대해 설명하고 있습니다. 소프트웨어적으로는 Internet을 "network of networks"로 정의하고, 데이터 전송을 위한 프로토콜과 인터넷 표준에 대해 다루고 있습니다. 또한 RFC와 IETF에 대한 정보도 포함되어 있습니다.
이 문서는 인터넷의 '서비스' 관점에 대해 다루고 있습니다. 인터넷은 network applications에 service를 제공하는 infrastructure이며, programming interface인 API를 제공합니다. API는 두 소프트웨어 간에 통신을 가능하게 하는 매커니즘으로, 예를 들어 기상청의 소프트웨어 시스템과 휴대폰의 날씨 앱이 API를 통해 통신하여 최신 날씨 정보를 제공합니다. 또한 프로토콜은 컴퓨터나 원거리 통신 장비 사이에서 메시지를 주고 받는 양식과 규칙의 체계이며, 통신 규약 및 약속이라고 설명됩니다. 프로토콜은 통신 규약을 제어하고 메시지를 송수신하는 역할을 합니다. 이 문서에서는 HTTP, TCP, IP, Wifi, 4G, Ethernet 등의 프로토콜이 언급되었으며, 이러한 프로토콜은 서로 다른 device 간의 통신을 가능하게 합니다. Network를 구성하는 요소로는 프로토콜뿐만 아니라 infrastructure와 service가 있습니다.
이 문서는 인터넷의 구성 요소 중 Network Edge와 Access Networks, Physical Media에 대해 다루고 있습니다. Network Edge에는 Hosts(클라이언트와 서버)가 있으며, 서버는 데이터 센터에 위치할 수 있습니다. Access Networks는 edge와 core를 연결하는데 사용되며, wired와 wireless communication links(광케이블, wifi, 4g, 인공위성 등)를 이용합니다.
이 문서는 end systems를 edge router에 연결하는 방법과 Access Networks에 대한 내용을 다루고 있습니다. residential access networks, institutional access networks, mobile access networks를 설치하여 end systems을 edge router에 연결하는 방법이 소개되었으며, Cable-based Access와 Digital Subscriber Line(DSL)에 대한 설명이 포함되어 있습니다. Cable-based Access는 frequency division multiplexing과 hybrid fiber coax 기술을 사용하며, downstream 전송률이 upstream 전송률보다 높은 특징을 가지고 있습니다. DSL은 기존 전화선을 사용하여 데이터를 전송하는 방법으로, downstream 전송률이 upstream 전송률보다 높은 이유에 대해 설명하고 있습니다.
이 문서는 다양한 네트워크 유형에 대해 다루고 있습니다. Home Network에서는 이제 DSL이 아닌 공유기에 router를 사용하는 방법이 소개되며, firewall과 NAT의 역할에 대해 설명하고 있습니다. Wireless Access Network에서는 WLAN과 Wide-area cellular access networks에 대해 다루고 있으며, Enterprise Networks에서는 국가나 대학 등에서 사용되는 네트워크 유형과 유선 Ethernet 케이블 및 Wifi의 활용에 대해 설명하고 있습니다. 마지막으로 Network Core에서는 데이터 전송을 담당하는 ISP와 DSL에 대해 다루고 있습니다.
이 문서는 네트워크와 호스트 간 통신에 관한 내용을 다루고 있습니다. 네트워크는 상호연결된 라우터들로 구성되어 있고, 호스트는 데이터 조각을 보내는 역할을 합니다. 호스트는 데이터를 작은 패킷으로 쪼개서 네트워크로 보내며, 전송률은 링크의 용량 또는 대역폭에 의해 결정됩니다. 물리 링크는 송신자와 수신자 간의 연결을 의미하고, 신호는 유선 매체를 통해 전달됩니다.
이 문서는 네트워크 코어와 미디어 통신에 관한 내용을 다루고 있습니다. 미디어 통신은 유도 및 비유도 미디어로 나뉘며, 코어 네트워크는 연결된 라우터로 이루어진 집합체이며 패킷 전송을 이용합니다. 패킷 전송은 Store and Forward 방식을 사용하며, 전송 및 종단 간 지연이 발생합니다. 또한, 패킷 전송은 큐잉 지연과 손실이라는 두 가지 문제점을 가지고 있습니다.
이 문서에서는 네트워크의 핵심 기능인 Forwarding과 Routing에 대해 설명하고 있습니다. Forwarding은 로컬 액션으로, 라우터의 입력 링크에 도착한 패킷을 적절한 출력 링크로 보내는 것을 말하며, Routing은 글로벌 액션으로, 패킷들의 경로를 정해주는 것을 말합니다. 또한 회로 스위칭에 대해 설명하고 있으며, FDM과 TDM 방식을 소개하고 있습니다. 회로 스위칭은 하나의 회선을 할당받아 데이터를 주고 받는 방식으로, dedicated resources를 사용하여 다른 사람이 끼어들지 못하게 합니다. 전화 등 실시간 통신에 주로 사용됩니다.
이 문서는 대역폭을 여러 작은 채널로 분할하여 여러 단말기가 동시에 이용하는 TDM 방식과 Packet switching vs Circuit Switching의 차이, 그리고 인터넷 구조를 "Network of Networks"로 설명하고 있다. 또한, 모든 라우터를 직접 연결하는 것은 복잡하므로 지역 ISP망을 설치하여 네트워크의 복잡도를 줄인다는 내용이 포함되어 있다.
문서에는 1일차의 내용으로 "10"이 기록되어 있습니다.
"""

prompt = f"""
아래 내용에서 가장 핵심 내용으로 질문을 만들어줘.
내용: {text}

답변: """


response = llm.invoke(prompt)
print(response)