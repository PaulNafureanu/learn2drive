// All content in one place so it can later be replaced by Sanity data.
// The empty fields below are intentional: don't publish guessed details.

export type RoadmapStep = { title: string; description: string };
export type FAQ = { question: string; answer: string };
export type Instructor = {
  name: string;
  role: string;
  description: string;
  imageUrl?: string;
};
export type Offer = {
  title: string;
  description: string;
  price?: string;
  highlights: string[];
};

export type SiteContent = {
  schoolName: string;
  hero: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    imageUrl: string;
  };
  roadmap: RoadmapStep[];
  faq: FAQ[];
  instructors: Instructor[];
  offers: Offer[];
  googleReviewsUrl: string;
  contact: {
    phone: string;
    email: string;
    address: string;
    mapsUrl: string;
    mapEmbedUrl: string;
  };
};

export const content: SiteContent = {
  schoolName: "Learn2Drive",
  hero: {
    eyebrow: "Școală de șoferi",
    title: "Învață să conduci cu încredere.",
    description: "Fiecare drum începe cu un prim pas. Hai să vorbim despre pregătirea ta pentru permisul de conducere.",
    cta: "Hai să vorbim",
    imageUrl: "", // Add the real school photo when available
  },
  roadmap: [
    {
      title: "Ne contactezi",
      description: "Ne spui că vrei să începi și discutăm ce ai nevoie.",
    },
    {
      title: "Stabilim detaliile",
      description: "Primești informațiile despre înscriere și program.",
    },
    {
      title: "Începi pregătirea",
      description: "Parcurgi pregătirea teoretică și practică.",
    },
    {
      title: "Te pregătești pentru examen",
      description: "Lucrezi la încredere, atenție și deprinderile de condus.",
    },
  ],
  faq: [
    {
      question: "Cum pot afla detalii despre înscriere?",
      answer: "Scrie-ne sau sună-ne și îți explicăm pașii necesari.",
    },
    {
      question: "Unde se desfășoară pregătirea?",
      answer: "Contactează-ne pentru informații despre locație și program.",
    },
    {
      question: "Cum aflu prețul și ce include?",
      answer: "Îți oferim informațiile actualizate despre cursuri și costuri la cerere.",
    },
  ],
  instructors: [], // Real names, bios and photos will come from the instructor
  offers: [], // Add verified courses and prices later
  googleReviewsUrl: "", // Paste the official Google Maps profile / reviews link
  contact: {
    phone: "", // Example format: +407xxxxxxxx
    email: "",
    address: "",
    mapsUrl: "", // Link to the verified Google Maps listing
    mapEmbedUrl: "", // Use Google's 'Share -> Embed a map' iframe src
  },
};
