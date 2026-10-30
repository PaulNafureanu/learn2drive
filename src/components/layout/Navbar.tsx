import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { sanityClient, urlFor } from "../../lib/sanity";

type NavigationItem = {
  _key: string;
  label: string;
  href: string;
};

type SiteSettings = {
  schoolName?: string;
  logo?: {
    asset?: { _ref: string };
    alt?: string;
  };
  navigation?: NavigationItem[];
  headerButton?: {
    label?: string;
    href?: string;
  };
};

const SETTINGS_QUERY = `
  *[_type == "siteSettings" && _id == "siteSettings"][0] {
    schoolName,
    logo,
    navigation,
    headerButton
  }
`;

const defaultSettings: SiteSettings = {
  schoolName: "LEARN2DRIVE",
  navigation: [
    { _key: "home", label: "Acasă", href: "#acasa" },
    { _key: "courses", label: "Cursuri", href: "#cursuri" },
    { _key: "about", label: "Despre noi", href: "#despre" },
    { _key: "contact", label: "Contact", href: "#contact" },
  ],
  headerButton: {
    label: "Înscrie-te acum",
    href: "#contact",
  },
};

// Only allow normal website links.
function safeHref(href?: string) {
  const value = href?.trim() || "";

  if (
    /^#[a-zA-Z][\w-]*$/.test(value) ||
    (value.startsWith("/") && !value.startsWith("//")) ||
    /^https?:\/\/[^\s]+$/i.test(value) ||
    /^mailto:[^\s]+$/i.test(value) ||
    /^tel:\+?[\d\s()-]+$/i.test(value)
  ) {
    return value;
  }

  return "#acasa";
}

export default function Navbar() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;

    sanityClient
      .fetch<SiteSettings | null>(SETTINGS_QUERY)
      .then((data) => {
        if (!active || !data) return;

        setSettings({
          ...defaultSettings,
          ...data,
        });
      })
      .catch((error) => {
        console.error("Could not load site settings:", error);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const navigation = settings.navigation ?? [];
  const button = settings.headerButton;

  const logoUrl = settings.logo?.asset?._ref ? urlFor(settings.logo).width(500).auto("format").url() : null;

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-[#F5F5F3]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        {/* BRAND */}
        <a
          href="#acasa"
          onClick={closeMenu}
          className="flex shrink-0 items-center"
          aria-label={`${settings.schoolName || "LEARN2DRIVE"} - Acasă`}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={settings.logo?.alt || settings.schoolName || "Logo"}
              className="h-12 w-auto max-w-[190px] object-contain"
            />
          ) : (
            <span className="text-[22px] font-black tracking-[-0.065em] text-[#171717] sm:text-2xl">
              {settings.schoolName || "LEARN2DRIVE"}
              <span className="text-blue-600">.</span>
            </span>
          )}
        </a>

        {/* DESKTOP NAVIGATION */}
        <nav aria-label="Navigare principală" className="hidden items-center gap-7 lg:flex xl:gap-9">
          {navigation.map((item) => (
            <a
              key={item._key}
              href={safeHref(item.href)}
              className="whitespace-nowrap text-sm font-medium text-neutral-600 transition-colors hover:text-blue-600"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* DESKTOP CTA */}
        {button?.label && (
          <a
            href={safeHref(button.href)}
            className="hidden shrink-0 items-center gap-2 rounded-full bg-[#171717] px-5 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600 lg:inline-flex"
          >
            {button.label}
            <ArrowUpRight size={17} />
          </a>
        )}

        {/* MOBILE TOGGLE */}
        <button
          type="button"
          aria-label={menuOpen ? "Închide meniul" : "Deschide meniul"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((previous) => !previous)}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white/75 text-[#171717] transition-colors hover:bg-white lg:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* MOBILE NAVIGATION */}
      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Navigare mobilă"
          className="border-t border-black/5 bg-[#F5F5F3] px-5 pb-6 pt-4 shadow-lg shadow-black/5 sm:px-8 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigation.map((item) => (
              <a
                key={item._key}
                href={safeHref(item.href)}
                onClick={closeMenu}
                className="rounded-xl px-4 py-3.5 text-base font-semibold text-[#171717] transition-colors hover:bg-white hover:text-blue-600"
              >
                {item.label}
              </a>
            ))}

            {button?.label && (
              <a
                href={safeHref(button.href)}
                onClick={closeMenu}
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                {button.label}
                <ArrowUpRight size={18} />
              </a>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
