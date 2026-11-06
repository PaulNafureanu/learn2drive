import { useEffect } from "react";
import { useSanityQuery } from "../hooks/useSanityQuery";
import { SEO_QUERY, SEO_LISTEN_QUERY } from "./queries";

type SeoData = {
  title?: string | null;
  description?: string | null;
  socialImageUrl?: string | null;
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

export default function SeoSettings() {
  const { data } = useSanityQuery<SeoData>({
    loadingQuery: SEO_QUERY,
    listeningQuery: SEO_LISTEN_QUERY,
    loadingErrorMsg: "Failed to load SEO settings",
    listeningErrorMsg: "SEO listener failed",
  });

  useEffect(() => {
    const title = data?.title?.trim() || DEFAULT_SEO.title;

    const description = data?.description?.trim() || DEFAULT_SEO.description;

    const image = data?.socialImageUrl || DEFAULT_SEO.socialImageUrl;

    // Browser title
    document.title = title;

    // Google
    updateMeta('meta[name="description"]', description);

    // Open Graph
    updateMeta('meta[property="og:title"]', title);
    updateMeta('meta[property="og:description"]', description);
    updateMeta('meta[property="og:image"]', image);

    // Twitter / X
    updateMeta('meta[name="twitter:title"]', title);
    updateMeta('meta[name="twitter:description"]', description);
    updateMeta('meta[name="twitter:image"]', image);
  }, [data]);

  return null;
}
