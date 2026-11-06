import SeoSettings from "./SeoSettings";
import Hero from "../components/sections/hero/Hero";
import NavBar from "../components/sections/navbar/NavBar";
import ContactSection from "../components/sections/contact/ContactSection";
import Footer from "../components/sections/footer/Footer";

import { useSanityQuery } from "../hooks/useSanityQuery";

import { SITE_SETTINGS_QUERY, SITE_SETTINGS_LISTEN_QUERY } from "./queries";

import type { SiteSettingsData } from "./types";

export default function Website() {
  const { data } = useSanityQuery<SiteSettingsData>({
    loadingQuery: SITE_SETTINGS_QUERY,
    listeningQuery: SITE_SETTINGS_LISTEN_QUERY,
    loadingErrorMsg: "Failed to load site settings",
    listeningErrorMsg: "Site settings listener failed",
  });

  const logo = {
    schoolName: data?.schoolName ?? "LEARN2DRIVE",
    logoUrl: data?.logo?.asset?.url ?? "",
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#171717]">
      <SeoSettings seo={data?.seo} />

      <NavBar logo={logo} />

      <main>
        <Hero />
        <ContactSection settings={data} />
      </main>

      <Footer settings={data} />
    </div>
  );
}
