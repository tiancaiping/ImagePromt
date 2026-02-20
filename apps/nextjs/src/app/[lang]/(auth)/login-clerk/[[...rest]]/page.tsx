import { redirect } from "next/navigation";
import type { Locale } from "~/config/i18n-config";

export default function LoginPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  redirect(`/${lang}/login`);
}
