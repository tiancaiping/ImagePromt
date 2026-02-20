import { cn } from "@saasfly/ui";

interface DocsPageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  heading: string;
  text?: string;
}

export function DocsPageHeader({
  heading,
  text,
  className,
  ...props
}: DocsPageHeaderProps) {
  const cnTyped = cn as unknown as (...inputs: unknown[]) => string;
  return (
    <>
      <div className={cnTyped("space-y-4", className)} {...props}>
        <h1 className="font-heading inline-block text-4xl lg:text-5xl">
          {heading}
        </h1>
        {text && <p className="text-xl text-muted-foreground">{text}</p>}
      </div>
      <hr className="my-4" />
    </>
  );
}
