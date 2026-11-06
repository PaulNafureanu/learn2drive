export const NAVBAR_QUERY = `
  *[_id == "navBar"][0]{
    navigation[]{
      _key,
      label,
      href,
      children[]{
        _key,
        label,
        href
      }
    }
  }
`;

export const NAVBAR_LISTEN_QUERY = `
  *[_id == "navBar"]
`;

export const HERO_QUERY = `
  *[_id == "hero"][0]{
    title,
    highlight,
    description,

    images[]{
      _key,
      alt,
      asset,
      crop,
      hotspot
    },

    primaryButton{
      label,
      href
    },

    secondaryButton{
      label,
      href
    }
  }
`;

export const HERO_LISTEN_QUERY = `
  *[_id == "hero"]
`;
