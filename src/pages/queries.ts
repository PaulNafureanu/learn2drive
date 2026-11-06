export const SITE_SETTINGS_QUERY = `
  *[_id == "siteSettings"][0]{
    schoolName,
    logo {
      alt,
      asset->{
        url
      }
    }
  }
`;

export const SITE_SETTINGS_LISTEN_QUERY = `
  *[_id == "siteSettings"]
`;

export const SEO_QUERY = `
  *[_id == "siteSettings"][0]{
    "title": seo.title,
    "description": seo.description,
    "socialImageUrl": seo.socialImage.asset->url
  }
`;

export const SEO_LISTEN_QUERY = `
  *[_id == "siteSettings"]
`;
