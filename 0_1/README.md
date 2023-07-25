# VITE REACT TEMPLATE

## 포함된 중요 라이브러리

- @emotion/react
- @mui/icons-material
- react-router-dom
- prettier, eslint-plugin-prettier, eslint-config-prettier

## 사용법

just clone

# 문제 0-1. 계산기 만들기

## 완성 예시

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/79640e33-6e4c-490d-870a-0ede9e443a70/Untitled.png)

## prettier

혹시 적용이 되지 않는다면 아래 글 참조

https://velog.io/@bluejoyq/Next-JSTypescript-Eslint-Prettier-Init

## 규칙

- 스타일링은 신경쓰지 않아도 좋습니다.
- 내부 폴더 구조 또한 마음대로 해도 좋습니다.
- 라이브러리의 추가 설치는 금지입니다.
- GPT는 사용 금지!

## 목표

### 시작 및 제출

- https://github.com/bluejoyq/react-studies을 clone해서 시작하시면 됩니다. 0_1 폴더를 이용하세요!
- 제출은 https://github.com/bluejoyq/react-studies에 PR을 통해 남겨주세요.

### **기본 UI 구성**

- 디스플레이 영역: 현재 입력된 숫자나 계산 결과를 보여준다.
- 버튼 영역: 숫자 (0-9)와 연산자 (+, -, *, /, =) 버튼, 그리고 'AC' 버튼이 포함되어야 한다. 추가로 소수점('.'), 부호 변경('+/-'), 백분율('%') 버튼도 포함시킨다.

### **기능 요구사항**

- 숫자 버튼 클릭: 디스플레이에 해당 숫자를 추가한다.
- 연산자 버튼 클릭: 현재 디스플레이의 숫자를 저장하고, 선택한 연산자를 기억한다.
- '=' 버튼 클릭 또는 엔터 키 입력: 저장된 숫자와 현재 디스플레이의 숫자를 사용하여 연산을 수행하고 결과를 디스플레이에 표시한다.
- 'AC' 버튼 클릭 또는 'esc' 키 입력: 디스플레이를 '0'으로 만든다.
- 소수점('.') 버튼 또는 '.' 키 입력: 실수 연산을 지원한다. (이미 소수점이 있다면 추가로 입력하지 않는다.)
- +/- 버튼: 현재 디스플레이의 숫자의 부호를 변경한다.
- '%' 버튼: 현재 숫자를 100으로 나눠 백분율 값을 표시한다.
- 키보드 입력 지원: 숫자 (0-9) 및 연산자 (+, -, *, /)와 'esc' 및 'enter' 키를 통한 입력을 지원한다.

### **에러 처리**

- 0으로 나눌 때: "Error" 메시지 표시.
- 입력된 숫자가 너무 크거나 연산 결과가 너무 큰 경우: "Overflow" 메시지 표시.