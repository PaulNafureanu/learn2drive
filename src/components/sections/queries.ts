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

export const FAQ_QUERY = `
  *[_id == "faq"][0]{
    title,
    description,
    questions[]{
      _key,
      question,
      answer
    }
  }
`;

export const FAQ_LISTEN_QUERY = `
  *[_id == "faq"]
`;

export const REVIEWS_QUERY = `
  *[_id == "reviews"][0]{
    title,
    description,
    testimonials[]{
      _key,
      author,
      rating,
      text,
      date
    }
  }
`;

export const REVIEWS_LISTEN_QUERY = `
  *[_id == "reviews"]
`;

export const ABOUT_QUERY = `
  *[_id == "about"][0]{
    title,
    highlight,
    description,
    roadmapTitle,
    steps[]{
      _key,
      title,
      description,
      icon
    }
  }
`;

export const ABOUT_LISTEN_QUERY = `
  *[_id == "about"]
`;

export const COURSE_GUIDE_QUERY = `
  *[_id == "courseGuide"][0]{
    title,
    description,
    courses[]{
      _key,
      category,
      description,
      minimumAge,
      exam,
      note,
      plans[]{
        _key,
        label,
        theoryHours,
        practiceHours,
        minimumKm,
        minimumWeeks
      }
    },
    documents[]{
      _key,
      title,
      description
    }
  }
`;

export const COURSE_GUIDE_LISTEN_QUERY = `
  *[_id == "courseGuide"]
`;
