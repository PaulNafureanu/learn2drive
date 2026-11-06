export const SITE_SETTINGS_QUERY = `
  *[_id == "siteSettings"][0]{
    schoolName,
    logo {
      alt,
      asset->{
        url
      }
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
