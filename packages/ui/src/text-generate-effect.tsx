"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, stagger, useAnimate } from "framer-motion";

import { cn } from "./utils/cn";

type AnimateScope<T extends Element> = { current: T | null };
type AnimateFn = (
  selector: string,
  keyframes: Record<string, number | string>,
  options?: { duration?: number; delay?: number },
) => Promise<void>;
const useAnimateTyped = useAnimate as unknown as <T extends Element>() => [
  AnimateScope<T>,
  AnimateFn,
];

const TextGenerateEffectImpl = ({
  words,
  className,
}: {
  words: string;
  className?: string;
}) => {
  const [scope, animate] = useAnimateTyped<HTMLDivElement>();
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

export const TextGenerateEffect = dynamic(
  () => Promise.resolve(TextGenerateEffectImpl),
  {
    ssr: false,
  },
);
