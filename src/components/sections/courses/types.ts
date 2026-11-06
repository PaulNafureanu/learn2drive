export type TrainingPlan = {
  _key: string;
  label: string;
  theoryHours: number;
  practiceHours: number;
  minimumKm: number;
  minimumWeeks: number;
};

export type CourseCategory = {
  _key: string;
  category: string;
  description: string;
  minimumAge: string;
  exam?: string | null;
  note?: string | null;
  plans: TrainingPlan[];
};

export type RequiredDocument = {
  _key: string;
  title: string;
  description?: string | null;
};

export type CourseGuideData = {
  title: string;
  description?: string | null;
  courses?: CourseCategory[] | null;
  documents?: RequiredDocument[] | null;
};
