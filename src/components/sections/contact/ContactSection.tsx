import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

import type { SiteSettingsData } from "../../../pages/types";
import ContactForm from "./ContactForm";
import ContactHours from "./ContactHours";
import ContactMap from "./ContactMap";

type Props = {
  settings: SiteSettingsData | null;
};

export default function ContactSection({ settings }: Props) {
  const phone = settings?.phone?.trim();
  const email = settings?.email?.trim();

  const address = settings?.address;
  const addressText = [address?.street, address?.city, address?.county, address?.country].filter(Boolean).join(", ");

  const mapsUrl =
    settings?.googleMapsUrl ||
    (addressText ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}` : null);

  return (
    <section id="contact" aria-labelledby="contact-title" className="mx-auto w-[90%] py-16 sm:py-20 lg:py-24">
      {/* CENTERED HEADING */}
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 id="contact-title" className="text-4xl font-extrabold tracking-tight text-[#171717] sm:text-5xl">
          Hai să <span className="text-blue-600">vorbim!</span>
        </h2>

        <p className="mt-4 text-base leading-relaxed text-neutral-600 sm:text-lg">
          Ai întrebări despre cursuri sau înscriere? Suntem aici să te ajutăm.
        </p>
      </div>

      {/* Single unified container */}
      <div className="grid overflow-hidden rounded-[28px] bg-white shadow-sm lg:grid-cols-2">
        {/* LEFT: CONTACT FORM */}
        <div className="min-w-0 p-6 sm:p-10 lg:p-12">
          <ContactForm />
        </div>

        {/* RIGHT: MAP + INFORMATION */}
        <div className="flex min-w-0 flex-col gap-8 bg-[#E9E9E7] p-6 sm:p-10 lg:p-12">
          {/* MAP FIRST */}
          <ContactMap embedUrl={settings?.googleMapsEmbedUrl} mapsUrl={mapsUrl} />

          {/* TWO COLUMNS UNDER MAP */}
          <div className="grid gap-8 border-t border-black/10 pt-7 md:grid-cols-2 lg:gap-6">
            {/* CONTACT DETAILS */}
            <div className="min-w-0">
              <h3 className="mb-5 text-xl font-bold text-[#171717]">Date de contact</h3>

              <div className="space-y-5">
                {phone && (
                  <div className="flex items-start gap-3">
                    <Phone size={18} className="mt-1 shrink-0 text-blue-600" aria-hidden="true" />

                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500">Telefon</p>

                      <a
                        href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                        className="break-words text-sm font-semibold text-[#171717] hover:text-blue-600"
                      >
                        {phone}
                      </a>
                    </div>
                  </div>
                )}

                {email && (
                  <div className="flex items-start gap-3">
                    <Mail size={18} className="mt-1 shrink-0 text-blue-600" aria-hidden="true" />

                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500">Email</p>

                      <a
                        href={`mailto:${email}`}
                        className="break-all text-sm font-semibold text-[#171717] hover:text-blue-600"
                      >
                        {email}
                      </a>
                    </div>
                  </div>
                )}

                {addressText && (
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="mt-1 shrink-0 text-blue-600" aria-hidden="true" />

                    <div className="min-w-0">
                      <p className="text-xs text-neutral-500">Adresă</p>

                      <p className="text-sm font-semibold text-[#171717]">{addressText}</p>

                      {mapsUrl && (
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                        >
                          Vezi pe Google Maps
                          <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* OPENING HOURS */}
            <div className="min-w-0">
              <ContactHours hours={settings?.openingHours} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
