/**
 * 블로그 주제 목록
 *
 * /auto-blog-setup 스킬 실행 시 이 파일이 자동으로 교체됩니다.
 * 아래는 구조 예시입니다 — 실제 운영 시에는 스킬이 130개 주제를 생성합니다.
 */

export interface Topic {
  index: number;
  slug: string;
  level: "기초편" | "중급편" | "고급편";
  category: "before" | "bidding" | "after" | "tax" | "law" | "ai";
  title: string;
  keywords: string;
  meta_description: string;
}

// ── 예시 주제 (스킬 실행 시 니치에 맞게 130개로 교체됩니다) ──
export const allTopics: Topic[] = [
  {
    index: 1, slug: "basic-001", level: "기초편", category: "before",
    title: "이 블로그 주제 완전 초보 가이드",
    keywords: "입문,기초,가이드",
    meta_description: "완전 초보도 이해할 수 있게 이 블로그의 핵심 주제를 쉽게 설명합니다.",
  },
  {
    index: 2, slug: "basic-002", level: "기초편", category: "bidding",
    title: "꼭 알아야 할 핵심 개념 10가지",
    keywords: "핵심개념,기초지식,필수용어",
    meta_description: "이 분야를 공부할 때 반드시 알아야 할 핵심 개념 10가지를 정리합니다.",
  },
  {
    index: 3, slug: "basic-003", level: "기초편", category: "law",
    title: "초보자가 가장 많이 하는 실수 5가지",
    keywords: "초보실수,주의사항,실패사례",
    meta_description: "처음 시작하는 사람들이 자주 하는 실수와 피하는 방법을 알아봅니다.",
  },
  {
    index: 4, slug: "mid-001", level: "중급편", category: "after",
    title: "중급자를 위한 심화 전략",
    keywords: "중급전략,심화학습,실전적용",
    meta_description: "기초를 넘어 더 깊은 수준의 전략과 실전 노하우를 공유합니다.",
  },
  {
    index: 5, slug: "adv-001", level: "고급편", category: "ai",
    title: "AI 도구를 활용한 고급 접근법",
    keywords: "AI활용,고급기법,자동화",
    meta_description: "AI 도구를 이 분야에 접목해 더 효율적으로 성과를 내는 방법을 소개합니다.",
  },
];
