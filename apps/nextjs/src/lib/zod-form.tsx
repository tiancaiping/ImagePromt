import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type UseFormProps } from "react-hook-form";
import type { ZodTypeAny, infer as ZodInfer } from "zod";

export function useZodForm<TSchema extends ZodTypeAny>(
  props: Omit<UseFormProps<ZodInfer<TSchema>>, "resolver"> & {
    schema: TSchema;
  },
) {
  const form = useForm<ZodInfer<TSchema>>({
    ...props,
    resolver: zodResolver(props.schema),
  });

  return form;
}
