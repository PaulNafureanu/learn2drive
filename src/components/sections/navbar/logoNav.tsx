import { useState } from "react";

export type LogoProps = {
  schoolName: string;
  logoUrl?: string | null;
};

export default function LogoNav({ schoolName, logoUrl }: LogoProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);

  const imageUrl = logoUrl || "/logo.png";
  const imageFailed = failedUrl === imageUrl;

  return (
    <a href="/" className="flex items-center gap-2">
      {!imageFailed && (
        <img
          src={imageUrl}
          alt={`Logo ${schoolName}`}
          className="h-10 w-auto max-w-40 object-contain"
          onError={() => setFailedUrl(imageUrl)}
        />
      )}

      <span className="text-xl font-bold text-gray-900">{schoolName.toUpperCase()}</span>
    </a>
  );
}
