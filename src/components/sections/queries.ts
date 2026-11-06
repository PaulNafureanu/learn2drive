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
