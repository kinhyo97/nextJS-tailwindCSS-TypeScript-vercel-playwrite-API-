import { test, expect } from "@playwright/test";

test("로그인 → 키워드 추가 → 뉴스 로딩 전체 흐름", async ({ page }) => {
  // 1) 로그인 페이지 이동
  await page.goto("http://localhost:3000/login");

  // 2) 로그인
  await page.fill("input[placeholder='이메일']", "test@test.com");
  await page.fill("input[placeholder='비밀번호']", "1234");

  await page.click("button:text('로그인')");

  // 3) /search 도착 확인
  await expect(page).toHaveURL("http://localhost:3000/search");

  // 4) 키워드 추가
  const keyword = "장원영";

  await page.fill("input[placeholder='키워드 입력']", keyword);
  await page.click("button:text('저장')");

  // 저장된 키워드 확인
  await expect(
  page.locator("h2:has-text('저장된 키워드') + ul li", { hasText: keyword })
).toBeVisible();
  // 5) 뉴스 섹션 생성될 때까지 기다림
  await expect(
    page.locator(`h3:has-text("${keyword}")`)
  ).toBeVisible({ timeout: 10000 });

  // 6) 해당 키워드 뉴스 10개 로드 확인
  const newsItems = page.locator(`h3:has-text("${keyword}") + ul li`);
  await expect(newsItems).toHaveCount(10);
});
