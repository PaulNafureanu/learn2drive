import SeoSettings from "./SeoSettings";
import Hero from "../components/sections/hero/Hero";
import NavBar from "../components/sections/navbar/NavBar";

import { useSanityQuery } from "../hooks/useSanityQuery";

import { SITE_SETTINGS_LISTEN_QUERY, SITE_SETTINGS_QUERY } from "./queries";

import type { SiteSettingsData } from "./types";

export default function Website() {
  const { data } = useSanityQuery<SiteSettingsData>({
    loadingQuery: SITE_SETTINGS_QUERY,
    listeningQuery: SITE_SETTINGS_LISTEN_QUERY,
    loadingErrorMsg: "Failed to load site settings",
    listeningErrorMsg: "Site settings listener failed",
  });

  const schoolName = data?.schoolName ?? "LEARN2DRIVE";
  const logoUrl = data?.logo?.asset?.url ?? "";

  const logo = { schoolName, logoUrl };

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#171717]">
      <SeoSettings seo={data?.seo} />

      <NavBar logo={logo} />

      <main>
        <Hero />
      </main>
    </div>
  );
}
