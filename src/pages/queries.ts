export const SITE_SETTINGS_QUERY = `
  *[_id == "siteSettings"][0]{
    schoolName,
    shortDescription,

    logo {
      alt,
      asset->{
        url
      }
    },

    phone,
    whatsapp,
    email,

    socialLinks[]{
      _key,
      platform,
      label,
      url
    },

    address {
      street,
      city,
      county,
      postalCode,
      country
    },

    googleMapsUrl,
    googleMapsEmbedUrl,

    openingHours[]{
      _key,
      day,
      closed,
      opens,
      closes
    },

    seo {
      title,
      description,
      "socialImageUrl": socialImage.asset->url
    }
  }
`;

export const SITE_SETTINGS_LISTEN_QUERY = `
  *[_id == "siteSettings"]
`;
