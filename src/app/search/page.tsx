"use client";

import { useEffect, useState } from "react";

export default function SearchPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [savedList, setSavedList] = useState<string[]>([]);
  const [keyword, setKeyword] = useState("");
  const [newsList, setNewsList] = useState<any[]>([]);

  // localStorage에서 userId 로딩
  useEffect(() => {
    const id = localStorage.getItem("userId");
    setUserId(id);
  }, []);

  // userInfo 불러오기
  useEffect(() => {
    if (!userId) return;

    const fetchUserInfo = async () => {
      const res = await fetch(`/api/userInfo?userId=${userId}`);
      const data = await res.json();

      if (data.success) {
        setEmail(data.email);
        setSavedList(data.favoriteKeywords);
      }
    };

    fetchUserInfo();
  }, [userId]);

  // 🔥 여기 추가된 부분: 뉴스 불러오기
  useEffect(() => {
    if (!userId) return;

    const fetchNews = async () => {
      const res = await fetch(`/api/news?userId=${userId}`);
      const data = await res.json();

      if (data.success) {
        setNewsList(data.data);   // [{keyword, items:[...] }]
      }

      console.log("뉴스 데이터:", data);
    };

    fetchNews();
  }, [userId, savedList]);

  return (
    <div style={{ padding: 20 }}>
      {/* <h2>로그인 정보</h2>
      <p>userId: {userId}</p>
      <p>email: {email}</p> */}

      <h2 style={{ marginTop: 30 }}>저장된 키워드</h2>
      <ul>
        {savedList.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>

      <h2 style={{ marginTop: 30 }}>키워드 추가</h2>

      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="키워드 입력"
      />
      <button
        onClick={async () => {
          if (!keyword.trim()) {
            alert("키워드를 입력하세요!");
            return;
          }

          const res = await fetch("/api/addkeyword", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              keyword,
            }),
          });

          const data = await res.json();
          if (data.success) {
            setSavedList(data.favoriteKeywords);
            setKeyword("");
          }
        }}
      >
        저장
      </button>

      {/* 🔥 뉴스 출력 */}
      <h2 style={{ marginTop: 40 }}>키워드 뉴스</h2>

      {newsList.map((section, idx) => (
        <div key={idx} style={{ marginTop: 20 }}>
          <h3>📌 {section.keyword}</h3>

          <ul>
            {section.items.map((item: any, i: number) => (
              <li key={i} style={{ marginBottom: 8 }}>
                <a href={item.link} target="_blank">
                  {item.title.replace(/<[^>]*>/g, "")}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
