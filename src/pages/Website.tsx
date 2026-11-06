import ContactSection from "../components/sections/contact/ContactSection";
import Footer from "../components/sections/footer/Footer";
import Hero from "../components/sections/hero/Hero";
import NavBar from "../components/sections/navbar/NavBar";
import SeoSettings from "./SeoSettings";

import { useSanityQuery } from "../hooks/useSanityQuery";

import { SITE_SETTINGS_LISTEN_QUERY, SITE_SETTINGS_QUERY } from "./queries";

import Faq from "../components/sections/faq/faq";
import Reviews from "../components/sections/reviews/Reviews";
import type { SiteSettingsData } from "./types";
import About from "../components/sections/about/About";
import Courses from "../components/sections/courses/Courses";

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
        <About />
        <Courses />
        <Faq />
        <Reviews mapsUrl={data?.googleMapsUrl} reviewUrl={data?.googleReviewUrl} />
        <ContactSection settings={data} />
      </main>

      <Footer settings={data} />
    </div>
  );
}
