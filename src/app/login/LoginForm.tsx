"use client";

import { useState } from "react";
import { useRouter} from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [result, setResult] = useState("");
  const Router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({ email, pw }),
    });

    const data = await res.json();
    setResult(data.message);

    if(data.success){
        localStorage.setItem("userId", data.userId);
        Router.push("/search");
    }

    console.log("서버응답:", data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <input
        type="password"
        placeholder="비밀번호"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        className="border p-2 w-full rounded"
      />

      <button
        type="submit"
        className="bg-blue-600 text-white p-2 w-full rounded"
      >
        로그인
      </button>

      {result && <p className="text-center mt-2">{result}</p>}
    </form>
  );
}
