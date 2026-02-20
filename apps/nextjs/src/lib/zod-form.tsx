import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver, type UseFormProps, type UseFormReturn } from "react-hook-form";
import type { ZodTypeAny, infer as ZodInfer } from "zod";

export function useZodForm<TSchema extends ZodTypeAny>(
  props: Omit<UseFormProps<ZodInfer<TSchema>>, "resolver"> & {
    schema: TSchema;
  },
) {
  const useFormTyped = useForm as unknown as <T>(
    props: UseFormProps<T>,
  ) => UseFormReturn<T>;
  const zodResolverTyped = zodResolver as unknown as <
    Schema extends ZodTypeAny,
  >(
    schema: Schema,
  ) => Resolver<ZodInfer<Schema>>;
  const form = useFormTyped<ZodInfer<TSchema>>({
    ...props,
    resolver: zodResolverTyped(props.schema),
  });

  return form;
}
