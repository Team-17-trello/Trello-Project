# 트렐로 프로젝트 - Trello

## 개요

이 프로젝트는 Nest.js 와 Node.js 를 사용하여 트렐로 서비스를 구현하는 과제입니다.

<br/>

## ✨ 주요 기능

- **메일 전송 기능**
- **알림 기능**
- **파일 업로드,다운로드**
- **리스트 & 카드 이동**

<br/>

## 📢 와이어 프레임

- [Figma](https://www.figma.com/board/6Xl7GhIWEY2UvwiYbz7naz/FigJam-basics?node-id=0-1&t=X7BDa8J9uD10z7x2-1)

<br/>

## 📚 사용 스택

<div align="left">
<div>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white">
 <img src="https://img.shields.io/badge/Nestjs-D91313?style=flat-square&logo=nestjs&logoColor=white">
</div>
<div>
  <img src="https://shields.io/badge/MySQL-lightgrey?logo=mysql&style=plastic&logoColor=white&labelColor=blue">
  <img src="https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=Redis&logoColor=white">
</div>
<div>
<img src="https://img.shields.io/badge/ESlint-4B32C3?style=flat-square&logo=eslint&logoColor=white">
<img src="https://img.shields.io/badge/Prettier-F7B93E?style=flat-square&logo=prettier&logoColor=white">
<img src="https://img.shields.io/badge/Slack-4A154B?style=flat-square&logo=slack&logoColor=white">
</div>
<div>
<img src="https://img.shields.io/badge/NodeMailer-339933?style=flat-square&logo=nodemailer&logoColor=white">
</div>
</div>

<br/><br/>

## 🔍 개발 과정

- [강현 : 카드 순서 변경 개발하기](https://devnter.tistory.com/entry/%ED%8A%B8%EB%A0%90%EB%A1%9C-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EB%A6%AC%EC%8A%A4%ED%8A%B8-%EC%B9%B4%EB%93%9C-%EB%B3%80%EA%B2%BD-%EA%B8%B0%EB%8A%A5-%EA%B0%9C%EB%B0%9C)
- [강현 : Member Guard를 통한 인가 처리하기](https://devnter.tistory.com/entry/%ED%8A%B8%EB%A0%90%EB%A1%9C-%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EB%A9%A4%EB%B2%84-%EA%B0%80%EB%93%9C%EB%A5%BC-%ED%86%B5%ED%95%B4-%EC%9D%B8%EA%B0%80-%EC%B2%98%EB%A6%AC%ED%95%98%EA%B8%B0)
- [민재 , 성록 : 메일 전송 개발하기](https://blog.naver.com/dmb08075/223657057035)
- [민재 , 성록 : 인증 코드 저장 처리](https://blog.naver.com/dmb08075/223657103077)
- [강필 : 파일 업다운로드 개발](https://velog.io/@skp1504/트렐로-프로젝트-파일-업로드다운로드-개발)
<br/>
## 📝 ERD

<img width="944" src="https://private-user-images.githubusercontent.com/174415370/385109533-74a88da9-1c35-4413-a49e-effc24c237e5.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3MzEzNzY3OTQsIm5iZiI6MTczMTM3NjQ5NCwicGF0aCI6Ii8xNzQ0MTUzNzAvMzg1MTA5NTMzLTc0YTg4ZGE5LTFjMzUtNDQxMy1hNDllLWVmZmMyNGMyMzdlNS5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjQxMTEyJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI0MTExMlQwMTU0NTRaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1mYjg5MjY0ZTVkNjhmYmQ1NGM2ZTBmODg5MWE4OGU4YjYzY2NkYjE2MmU5MjllZjhiYzJlMmY2YjZlYzcyMjJkJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.7sMWjgVTCswaKireNc-94CQhbWf7LgQYJOVLR--lb4Y">

## 📁 Project Structure

```shell
Trello-Project
├── src
│   ├── auth
│   ├── board
│   ├── card
│   ├── checklist
│   ├── comment
│   ├── file
│   ├── guard
│   ├── item
│   ├── list
│   ├── member
│   ├── notification
│   ├── user
│   ├── utils
│   └── workspace
│       ├── app.controller.spec.ts
│       ├── app.controller.ts
│       ├── app.module.ts
│       ├── app.service.ts
│       └── main.ts
├── test
├── .gitignore
├── .prettierrc
├── eslint.config.js
├── nest-cli.json
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.build.json
└── tsconfig.json
```

<br/>

## 💻 Developers

<table>
    <tr align="center">
        <td><B>Leader / Backend<B></td>
        <td><B>Backend<B></td>
        <td><B>Backend<B></td>
        <td><B>Backend<B></td>
        <td><B>Backend<B></td>
        <td><B>Backend<B></td>
    </tr>
    <tr align="center">
        <td><B>문승호<B></td>
        <td><B>김성록<B></td>
        <td><B>최강현<B></td>
        <td><B>송강필<B></td>
        <td><B>양소린<B></td>
        <td><B>신민재<B></td>
    </tr>
    <tr align="center">
        <td>
            <img width="150" src="https://avatars.githubusercontent.com/u/53264081?v=4">
            <br>
            <a href="https://github.com/Jacob-moon/"><I>desktop-tutorial</I></a>
        </td>
        <td>
            <img width="150" src="https://avatars.githubusercontent.com/u/174415370?v=4">
            <br>
            <a href="https://github.com/SungRok1231"><I>SungRok1231</I></a>
        </td>
        <td>
            <img width="150" src="https://avatars.githubusercontent.com/u/127270767?v=4">
            <br>
            <a href="https://github.com/NterChoi"><I>NterChoi</I></a>
        </td>
        <td>
            <img width="150" src="https://avatars.githubusercontent.com/u/92740959?v=4">
            <br>
            <a href="https://github.com/strongfeel"><I>strongfeel</I></a>
        </td>
        <td>
            <img width="150" src="https://avatars.githubusercontent.com/u/177493080?v=4">
            <br>
            <a href="https://github.com/surinnnnnn"><I>surinnnnnn</I></a>
        </td>
        <td>
            <img width="150" src="https://avatars.githubusercontent.com/u/114797773?v=4">
            <br>
            <a href="https://github.com/New-mean"><I>New-mean</I></a>
        </td>
    </tr>
</table>
