import { ArrowUpRight, MapPin } from "lucide-react";

type Props = {
  embedUrl?: string | null;
  mapsUrl?: string | null;
};

export default function ContactMap({ embedUrl, mapsUrl }: Props) {
  let safeEmbedUrl: string | null = null;

  if (embedUrl) {
    try {
      const parsed = new URL(embedUrl);

      if (
        parsed.protocol === "https:" &&
        parsed.hostname === "www.google.com" &&
        parsed.pathname.startsWith("/maps/embed")
      ) {
        safeEmbedUrl = parsed.toString();
      }
    } catch {
      // Invalid URL - do not embed.
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-neutral-200">
      {safeEmbedUrl ? (
        <iframe
          title="Locația școlii LEARN2DRIVE pe Google Maps"
          src={safeEmbedUrl}
          className="h-[260px] w-full border-0 sm:h-[300px]"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <div className="flex h-[220px] flex-col items-center justify-center gap-3 px-6 text-center">
          <MapPin size={30} className="text-blue-600" aria-hidden="true" />
          <p className="text-sm text-neutral-600">Harta locației va fi disponibilă în curând.</p>

          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
            >
              Deschide Google Maps
              <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
