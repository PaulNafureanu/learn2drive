export type SeoData = {
  title?: string | null;
  description?: string | null;
  socialImageUrl?: string | null;
};

export type SocialLink = {
  _key: string;
  platform: string;
  label: string;
  url: string;
};

export type Address = {
  street?: string;
  city?: string;
  county?: string;
  postalCode?: string;
  country?: string;
};

export type Coordinates = {
  lat: number;
  lng: number;
};

export type OpeningHours = {
  _key: string;
  day: string;
  closed?: boolean;
  opens?: string;
  closes?: string;
};

export type SiteSettingsData = {
  schoolName: string;
  shortDescription?: string;

  logo?: {
    alt?: string;
    asset?: {
      url: string;
    } | null;
  } | null;

  phone?: string;
  whatsapp?: string;
  email?: string;

  socialLinks?: SocialLink[];

  address?: Address;
  coordinates?: Coordinates;
  googleMapsUrl?: string;

  openingHours?: OpeningHours[];

  seo?: SeoData | null;
};
