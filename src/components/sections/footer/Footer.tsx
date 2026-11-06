import { ArrowUpRight, Globe, Mail, Phone, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube, FaLinkedinIn, FaTiktok } from "react-icons/fa6";

import type { IconType } from "react-icons";
import type { SiteSettingsData } from "../../../pages/types";

type Props = {
  settings: SiteSettingsData | null;
};

const socialIcons: Record<string, IconType> = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  youtube: FaYoutube,
  linkedin: FaLinkedinIn,
  tiktok: FaTiktok,
};

export default function Footer({ settings }: Props) {
  const schoolName = settings?.schoolName ?? "LEARN2DRIVE";
  const phone = settings?.phone;
  const email = settings?.email;
  const socialLinks = settings?.socialLinks ?? [];

  const address = settings?.address;

  const addressText = [address?.street, address?.city, address?.county, address?.country].filter(Boolean).join(", ");

  const mapsUrl =
    settings?.googleMapsUrl ||
    "https://www.google.com/maps/search/?api=1&query=LEARN2DRIVE%20Strada%20Rediului%203%20Onesti%20Romania";

  return (
    <footer className="bg-[#171717] text-white">
      <div className="mx-auto w-[90%] pt-14 pb-8 sm:pt-20">
        {/* MAIN FOOTER */}
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          {/* LEFT: BRAND & SOCIAL MEDIA */}
          <div>
            <a href="/" className="text-2xl font-extrabold tracking-tight">
              {schoolName.toUpperCase()}
            </a>

            {settings?.shortDescription && (
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-neutral-400">{settings.shortDescription}</p>
            )}

            {socialLinks.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = socialIcons[social.platform];

                  return (
                    <a
                      key={social._key}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      title={social.label}
                      className="flex size-10 items-center justify-center rounded-full border border-white/15 text-neutral-300 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white"
                    >
                      {Icon ? <Icon size={18} aria-hidden="true" /> : <Globe size={18} aria-hidden="true" />}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: CONTACT */}
          <div className="md:justify-self-end md:w-full md:max-w-sm">
            <h3 className="mb-6 text-base font-semibold">Contact</h3>

            <div className="space-y-5">
              {phone && (
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                  className="flex items-start gap-3 text-sm text-neutral-400 transition hover:text-white"
                >
                  <Phone size={18} className="shrink-0" aria-hidden="true" />
                  {phone}
                </a>
              )}

              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-start gap-3 break-all text-sm text-neutral-400 transition hover:text-white"
                >
                  <Mail size={18} className="shrink-0" aria-hidden="true" />
                  {email}
                </a>
              )}

              {addressText && (
                <div className="flex items-start gap-3 text-sm text-neutral-400">
                  <MapPin size={18} className="shrink-0" aria-hidden="true" />

                  {mapsUrl ? (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-start gap-1 transition hover:text-white"
                      title="Vezi locația pe Google Maps"
                    >
                      <span>{addressText}</span>
                      <ArrowUpRight size={15} className="shrink-0" aria-hidden="true" />
                    </a>
                  ) : (
                    <span>{addressText}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {schoolName}. Toate drepturile rezervate.
          </p>

          <a href="#acasa" className="inline-flex items-center gap-1 transition hover:text-white">
            Înapoi sus
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
