"use client";

import { TextGenerateEffect } from "@saasfly/ui/text-generate-effect";

const words = `ImagePrompt turns your images into production-ready prompts with
            style, lighting, and composition details included.`;

const TextGenerateEffects = () => {
  return <TextGenerateEffect words={words} />;
};

export default TextGenerateEffects;
