import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

export const sanityClient = createClient({
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: "2026-10-30",
  useCdn: true,
  perspective: "published",
});

const builder = createImageUrlBuilder(sanityClient);

export const urlFor = (source: Parameters<typeof builder.image>[0]) => builder.image(source);
