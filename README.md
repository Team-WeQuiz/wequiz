<div align='center'>
<h3>Shall</h3>

<h3>.</h3>
<h3>.</h3>
<h3>.</h3>
<a href='https://github.com/Team-WeQuiz/wequiz'><img src="https://github.com/Team-WeQuiz/wequiz/assets/66217855/60bbbb34-284f-43a5-b3d5-4332ed856a9a"></a>
</div>

## 🤔 Overview
AI가 생성한 퀴즈를 친구들과 함께 푸는 서비스

## 🖱️ Usage
**1. PDF 자료를 퀴즈로 변환**  
> 유저가 pdf 파일을 입력하면 내용을 파싱 및 벡터화 하여 문서 내용을 기반으로 LLM이 퀴즈를 생성합니다.

**2. 퀴즈 방 생성**  
> 사용자들이 해당 퀴즈를 풀어볼 수 있는 방을 생성합니다.  
> 간단한 이모지 및 채팅으로 의사소통을 할 수 있습니다.

**3. 실시간 퀴즈 풀기**  
> 생성된 방에서 게임이 시작되면, 사용자는 실시간으로 퀴즈를 풀어볼 수 있습니다.  
> 문제 풀이는 순서대로 진행되며, 과반수가 해당 문제를 풀었을 경우 짧은 카운트 다운 후 다음 문제로 넘어갑니다.  
> 실시간으로 정답 여부에 따라 참여자들에게 점수가 부여됩니다.  
> 간단한 이모지로 의사소통을 할 수 있습니다.    

**4. 정답 공유**  
> 퀴즈가 모두 끝난 후, 최종 성적표가 제공됩니다.  
> 사용자는 서로가 작성한 답을 공유할 수 있으며, 이에 대한 토론을 나눌 수 있습니다.  
 


## 🎨 User Interface
<table>
    <tbody>
        <tr>
          <tr>
            <td align='center'><img src="https://github.com/Team-WeQuiz/wequiz/assets/66217855/906cc180-fa7d-4d1b-9705-b1c19f422b50" width="320"></td>
            <td align='center'><img src="https://github.com/Team-WeQuiz/wequiz/assets/66217855/5740c0a0-0352-4161-ac6f-854e0f8c4563" width="320"></td>
            <td align='center'><img src="https://github.com/Team-WeQuiz/wequiz/assets/66217855/ad07f448-9791-4a0e-83a0-e4814f270eaa" width="320"></td>
          </tr>
          <tr>
            <td align='center'>시작 페이지</td>
            <td align='center'>메인 로비</td>
            <td align='center'>방 만들기</td>
          </tr>
          <tr>
            <td align='center'><img src="https://github.com/Team-WeQuiz/wequiz/assets/66217855/ac3b2e52-5a5f-4806-b0c7-f29ce377f149" width="320"></td>
            <td align='center'><img src="https://github.com/Team-WeQuiz/wequiz/assets/66217855/893daebb-1c11-4083-843b-a9daf50cc908" width="320"></td>
            <td align='center'><img src="https://github.com/Team-WeQuiz/wequiz/assets/66217855/072351f1-e2b8-4894-b656-8e650708636e" width="320"></td>
          </tr>
          <tr>
            <td align='center'>방 접속</td>
            <td align='center'>퀴즈 풀이</td>
            <td align='center'>정답 확인</td>
          </tr>
        </tr>
    </tbody>
</table>


## 🛠️ Architecture
### 🎨 Front-end
`NEXT.JS`
### ⚙️ Back-end
`Spring boot`, `MySQL`
### 🤖 ML
`LangChain`, `FastAPI`

<table>
    <tbody>
        <tr>
          <tr>
            <td align='center'>전체 아키텍처</td>
          </tr>
          <tr>
            <td align='center'><img src="https://github.com/Team-WeQuiz/wequiz/assets/66217855/2f425a45-a1df-4855-bdf3-3191f6b7cf7b"></td>
          </tr>
          <tr>
            <td align='center'>CI / CD</td>
          </tr>
          <tr>
            <td align='center'><img src="https://blog.kakaocdn.net/dn/bOfFLH/btsGwbtmsSn/jmzsqE2A37iZHtXBaphlfK/img.png"></td>
          </tr>
    </tbody>
</table>


## 🚀 Team

<div align='center'>
  
<table>
    <thead>
        <tr>
            <th colspan="5"> Team WeQuiz </th>
        </tr>
    </thead>
    <tbody>
         <tr>
           <td align='center'><a href="https://github.com/noooey"><img src="https://avatars.githubusercontent.com/u/66217855?v=4" width="100" height="100"></td>
           <td align='center'><a href="https://github.com/cherry031"><img src="https://avatars.githubusercontent.com/u/66215132?v=4" width="100" height="100"></td>
           <td align='center'><a href="https://github.com/koomchang"><img src="https://avatars.githubusercontent.com/u/90228925?v=4" width="100" height="100"></td>
           <td align='center'><a href="https://github.com/KRimwoo"><img src="https://avatars.githubusercontent.com/u/66295173?v=4" width="100" height="100"></td>
           <td align='center'><a href="https://github.com/ryanbae94"><img src="https://avatars.githubusercontent.com/u/122738447?v=4" width="100" height="100"></td>
         </tr>
         <tr>
           <td align='center'>박규연</td>
           <td align='center'>심재민</td>
           <td align='center'>안금장</td>
           <td align='center'>김우림</td>
           <td align='center'>배준형</td>
         </tr>
         <tr>
           <td align='center'>ML</td>
           <td align='center'>BE</td>
           <td align='center'>BE</td>
           <td align='center'>FE</td>
           <td align='center'>FE</td>
         </tr>
    </tbody>
</table>

</div> 

---

2024-1 KMUCS 캡스톤디자인 | Copyright 2024. `WeQuiz` All rights reserved.
