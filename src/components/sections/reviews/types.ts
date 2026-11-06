export type Testimonial = {
  _key: string;
  author: string;
  rating?: number | null;
  text: string;
  date?: string | null;
};

export type ReviewsData = {
  title: string;
  description?: string | null;
  testimonials?: Testimonial[] | null;
};
