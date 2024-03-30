---
marp: true
paginate: true
---


# **😆 WeQuiz**

AI가 생성한 퀴즈를 친구들과 함께 푸는 서비스

> 24-1 KMUCS 캡스톤 1조, Team Wequiz

---

# 주제 선정 배경

> 투두메이트, 열품타 등 친구들과 실시간으로 함께하면 서로에게 좋은 동기부여가 된다

### 💡 퀴즈를 친구들과 실시간으로 함께 풀면 어떨까?


---

# 주제 선정 배경

> 학습을 위해 퀴즈를 만들고 싶은데, 다 학습을 해야 퀴즈를 작성할 수 있음
> 퀴즈를 만들 때 손으로 일일히 다 써야함
> 퀴즈를 내는 사람은 퀴즈를 같이 풀 수 없음 왜냐? 답을 다 아니까

### 💡 AI가 퀴즈를 자동으로 생성해주면 어떨까?


---

![bg 90%](https://github.com/Team-WeQuiz/wequiz/assets/66217855/88c4cb3a-63ce-410c-af84-eb8b1ada5582)


---

# 서비스 흐름

![image](https://github.com/Team-WeQuiz/wequiz/assets/66217855/270e6f9d-7546-4dee-8ede-359407c09989)

---

# 서비스 흐름 - 게임 진행 상세

> 퀴즈 풀이는 순서대로 진행되며,
각각의 **퀴즈마다 제한시간**이 적용됩니다.

1️⃣ 한 문제에 대한 답안을 **모두가 동시에 빠르게** 작성 
2️⃣ **과반수**가 그 문제를 풀면 3초 **카운트** 세고 바로 다음 문제로 넘어감
3️⃣ 문제 정답 여부에 따라 바로 점수에 반영
4️⃣ 1라운드 당 문제 N개의 문제, 총 3번의 라운드 진행
5️⃣ 라운드 별 등수 산출, 모든 라운드 끝난 후 최종 성적표 제공

---

![bg 100%](https://github.com/Team-WeQuiz/wequiz/assets/66217855/0eb72a8f-6594-4adf-8f55-cd13d7af461c)


---

![bg 100%](https://github.com/Team-WeQuiz/wequiz/assets/66217855/bc694516-8983-435e-8d55-159f3d102969)


---

![bg 100%](https://github.com/Team-WeQuiz/wequiz/assets/66217855/f0aafb7c-6ddb-4c5f-8fcd-989ab2f6ba43)

---


# 기대효과
- 학습의 게임화를 통한 학습 동기 부여 및 재미 요소 제공
- 다양한 분야에서 활용 가능

---

# 개발 진행 상황

![image](https://github.com/Team-WeQuiz/wequiz/assets/66217855/9984f1d3-7fa7-4b01-8157-6c425c06f482)

---

![bg left](https://github.com/Team-WeQuiz/wequiz/assets/66217855/9d5c5ba9-edd9-42e3-85a2-bb14845865cf)

### 통합 테스트
> 메인 기능을 중심으로
매주 통합 테스트 진행

---

![bg left](https://github.com/Team-WeQuiz/wequiz/assets/66217855/4183e229-bfb0-4ea7-bf9f-d802f946814e)



### 이슈 관리
> 이슈 사항에 우선순위를 부여하여
우선순위 높은 순으로 개발 진행


---

![bg left:35%](https://github.com/Team-WeQuiz/wequiz/assets/66217855/0afd6db8-a94e-4e19-ac72-8d2e08eb5e76)


# 기획 개선 사항 
### 문제
> N개의 퀴즈에 대해서 제한 시간 적용
```
1. 퀴즈 먼저 끝낸 사람들이 제한시간 끝날때까지 대기해야 함

2. 퀴즈의 난이도를 고려하지 않고 제한시간을 설정해야 함

3. 페이스가 느려 긴장감이 덜하고 재미가 부족함
```

---

![bg left:35%](https://github.com/Team-WeQuiz/wequiz/assets/66217855/b88bdd94-07ed-4535-abc9-b136c8ccb4bf)

### 해결
> 문제 단위로 시간 압박 적용
과반수 이상이 그 문제를 풀면 짧은 카운트다운 후 다음 문제로 넘어감.
```
1. 지루하게 기다리는 시간이 없어짐.

2. 생성된 문제의 난이도에 따라서 퀴즈 풀이 시간이 정해짐.
   따로 정해줄 필요 없음.

3. 페이스가 빠르게 진행되기 때문에 문제 푸는 사람들에게
   긴장감을 줌.
```

---

![bg left:35%](https://github.com/Team-WeQuiz/wequiz/assets/66217855/be25be0f-8275-4379-af4b-dd115a5cbb17)

# 기술 개선 사항
### 문제
> 파트마다 credential key값 저장 방식 제각각,
integration test 시 env파일을 주고 받아야 함.
### 해결
> AWS 시크릿 매니저를 도입해서 **한 곳**에서 모든 credential key값을 관리하도록 변경

```
key관리가 편해지고, env 파일 주고 받을 일이 없어짐.
```

---

# 🚀 팀 소개
![image](https://github.com/Team-WeQuiz/wequiz/assets/66217855/83759386-f1a1-4ce2-9f06-e391808c163c)


---


# 개발 목표
### ML
> 체인 구성 프롬프트 엔지니어링 및 실험으로  LLM의 아웃풋을 주도
### BE
> 일어날 수 있는 모든 시나리오에 대한 예외를 처리하여 사용자에게 완성도 높은 서비스를 제공
### FE
> 사용자 친화적인 UI/UX를 제공하고 정확한 실시간 처리를 통해 사용자에게 높은 만족감을 제공