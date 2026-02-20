"use client";

import React from "react";

import { InfiniteMovingCards } from "@saasfly/ui/infinite-moving-cards";

export function InfiniteMovingCardss() {
  return (
    <div className=" relative flex flex-col items-center justify-center overflow-hidden rounded-md antialiased">
      <InfiniteMovingCards items={reviews} direction="right" speed="slow" />
    </div>
  );
}

const reviews = [
  {
    quote:
      "ImagePrompt 让图片转提示词变得很顺畅，细节覆盖到位，省了我很多时间。",
    name: "王伟",
    title: "高级用户",
  },
  {
    quote:
      "ImagePrompt saves me hours on prompt crafting. The outputs are structured and easy to tweak.",
    name: "John Smith",
    title: "Power User",
  },
  {
    quote:
      "ImagePrompt なら構図や質感まで拾ってくれるので、再現性が上がりました。",
    name: "山田太郎",
    title: "ゴールドユーザー",
  },
  {
    quote:
      "이미지 분석이 정확하고, 프롬프트 결과가 일관돼서 작업 속도가 빨라졌어요.",
    name: "김민수",
    title: "VIP 사용자",
  },
  {
    quote:
      "Our team uses ImagePrompt daily. The prompts are clean, actionable, and model-ready.",
    name: "Emily Johnson",
    title: "Verified Buyer",
  },
];
