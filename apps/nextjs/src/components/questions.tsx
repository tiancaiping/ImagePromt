import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@saasfly/ui/accordion";

export function Questions() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>About ImagePrompt</AccordionTrigger>
        <AccordionContent>
          ImagePrompt turns images into production-ready prompts by extracting
          subject, style, lighting, composition, and camera details. It helps
          creators move faster with consistent, high-quality prompt output.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Why ImagePrompt?</AccordionTrigger>
        <AccordionContent>
          It saves time and improves consistency. You get structured prompts
          tuned for popular models with details that are easy to reuse and edit.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>How do I use it?</AccordionTrigger>
        <AccordionContent>
          Upload an image, describe your goal, pick a style, and generate a
          prompt. You can copy, edit, and reuse prompts across different models.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
