import { redirect } from "next/navigation";

import type { Locale } from "~/config/i18n-config";

export default function IndexPage({
  params: { lang },
}: {
  params: {
    lang: Locale;
  };
}) {
  redirect(`/${lang}/image-to-prompt`);
}
