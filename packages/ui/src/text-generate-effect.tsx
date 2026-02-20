"use client";

import { useEffect, type ComponentType } from "react";
import dynamic from "next/dynamic";
import { motion, stagger, useAnimate } from "framer-motion";

import { cn } from "./utils/cn";

interface TextGenerateEffectProps {
  words: string;
  className?: string;
}

const dynamicTyped = dynamic as unknown as <TProps>(
  loader: () => Promise<ComponentType<TProps>> | ComponentType<TProps>,
  options?: { ssr?: boolean },
) => ComponentType<TProps>;

const TextGenerateEffectImpl = ({
  words,
  className,
}: TextGenerateEffectProps) => {
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const wordsArray = words.split(" ");

  useEffect(() => {
    void animate(
      "span",
      {
        opacity: 1,
      },
      {
        duration: 2,
        delay: stagger(0.1),
      },
    );
  }, [animate, words]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              className="text-black opacity-0 dark:text-white"
            >
              {word}{" "}
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    <div className={cn("", className)}>
      <div className="mt-0">
        <div className="max-w-[750px] text-center text-lg font-light text-foreground">
          {renderWords()}
        </div>
      </div>
    </div>
  );
};

export const TextGenerateEffect = dynamicTyped<TextGenerateEffectProps>(
  () => Promise.resolve(TextGenerateEffectImpl),
  {
    ssr: false,
  },
);
