import { useEffect } from "react";
import type { SeoData } from "./types";

type Props = {
  seo?: SeoData | null;
};

const DEFAULT_SEO = {
  title: "LEARN2DRIVE | Școala de Șoferi",
  description:
    "LEARN2DRIVE - școală de șoferi dedicată pregătirii viitorilor conducători auto. Descoperă cursurile și înscrie-te!",
  socialImageUrl: "https://learn2drive.ro/logo.png",
};

function updateMeta(selector: string, content: string) {
  const element = document.querySelector<HTMLMetaElement>(selector);

  if (element) {
    element.content = content;
  }
}

export default function SeoSettings({ seo }: Props) {
  useEffect(() => {
    const title = seo?.title?.trim() || DEFAULT_SEO.title;

    const description = seo?.description?.trim() || DEFAULT_SEO.description;

    const socialImageUrl = seo?.socialImageUrl?.trim() || DEFAULT_SEO.socialImageUrl;

    // Browser title
    document.title = title;

    // Google
    updateMeta('meta[name="description"]', description);

    // Open Graph
    updateMeta('meta[property="og:title"]', title);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[property="og:image"]', socialImageUrl);

    // Twitter / X
    updateMeta('meta[name="twitter:title"]', title);
    updateMeta('meta[name="twitter:description"]', description);
    updateMeta('meta[name="twitter:image"]', socialImageUrl);
  }, [seo]);

  return null;
}
