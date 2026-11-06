export type SeoData = {
  title?: string | null;
  description?: string | null;
  socialImageUrl?: string | null;
};

export type SiteSettingsData = {
  schoolName: string;

  logo?: {
    alt?: string | null;
    asset?: {
      url: string;
    } | null;
  } | null;

  seo?: SeoData | null;
};
