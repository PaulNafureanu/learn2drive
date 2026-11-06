import {defineArrayMember, defineField, defineType} from 'sanity'

const categories = [
  {title: 'AM', value: 'AM'},
  {title: 'A1', value: 'A1'},
  {title: 'A2', value: 'A2'},
  {title: 'A', value: 'A'},
  {title: 'B1', value: 'B1'},
  {title: 'B', value: 'B'},
]

const plan = (
  _key: string,
  label: string,
  theoryHours: number,
  practiceHours: number,
  minimumKm: number,
  minimumWeeks: number,
) => ({
  _type: 'trainingPlan',
  _key,
  label,
  theoryHours,
  practiceHours,
  minimumKm,
  minimumWeeks,
})

const course = (
  category: string,
  description: string,
  minimumAge: string,
  exam: string,
  plans: ReturnType<typeof plan>[],
  note = '',
) => ({
  _type: 'courseCategory',
  _key: category.toLowerCase(),
  category,
  description,
  minimumAge,
  exam,
  note,
  plans,
})

export const courseGuideType = defineType({
  name: 'courseGuide',
  title: 'Categorii și cerințe',
  type: 'document',
  description: 'Informații despre categorii, ore, kilometri și înscriere.',

  fields: [
    defineField({
      name: 'title',
      title: 'Titlul secțiunii',
      type: 'string',
      initialValue: 'Alege categoria potrivită',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Descriere',
      type: 'text',
      rows: 2,
      initialValue: 'Descoperă cerințele de pregătire pentru fiecare categorie.',
    }),

    defineField({
      name: 'courses',
      title: 'Categorii disponibile',
      type: 'array',
      validation: (Rule) => Rule.required().min(1),

      of: [
        defineArrayMember({
          name: 'courseCategory',
          title: 'Categorie',
          type: 'object',

          fields: [
            defineField({
              name: 'category',
              title: 'Categoria',
              type: 'string',
              options: {list: categories},
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'description',
              title: 'Descrierea categoriei',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'minimumAge',
              title: 'Vârsta minimă pentru permis',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'exam',
              title: 'Proba practică',
              type: 'string',
              description: 'Exemplu: Poligon și traseu.',
            }),

            defineField({
              name: 'note',
              title: 'Informații suplimentare',
              type: 'text',
              rows: 3,
            }),

            defineField({
              name: 'plans',
              title: 'Planuri de pregătire',
              type: 'array',
              description: 'Adaugă variantele în funcție de permisul deja deținut.',
              validation: (Rule) => Rule.required().min(1),

              of: [
                defineArrayMember({
                  name: 'trainingPlan',
                  title: 'Plan de pregătire',
                  type: 'object',

                  fields: [
                    defineField({
                      name: 'label',
                      title: 'Condiție / permis deținut',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),

                    defineField({
                      name: 'theoryHours',
                      title: 'Ore de teorie',
                      type: 'number',
                      validation: (Rule) => Rule.required().integer().min(0),
                    }),

                    defineField({
                      name: 'practiceHours',
                      title: 'Ore de practică',
                      type: 'number',
                      validation: (Rule) => Rule.required().integer().min(0),
                    }),

                    defineField({
                      name: 'minimumKm',
                      title: 'Kilometri minimi',
                      type: 'number',
                      validation: (Rule) => Rule.required().min(0),
                    }),

                    defineField({
                      name: 'minimumWeeks',
                      title: 'Durata minimă (săptămâni)',
                      type: 'number',
                      validation: (Rule) => Rule.required().min(1),
                    }),
                  ],

                  preview: {
                    select: {
                      title: 'label',
                      theory: 'theoryHours',
                      practice: 'practiceHours',
                    },
                    prepare({title, theory, practice}) {
                      return {
                        title,
                        subtitle: `${theory ?? 0}h teorie · ${practice ?? 0}h practică`,
                      }
                    },
                  },
                }),
              ],
            }),
          ],

          preview: {
            select: {
              title: 'category',
              subtitle: 'description',
            },
          },
        }),
      ],

      initialValue: [
        course('AM', 'Mopede și scutere', '16 ani', 'Poligon', [
          plan('am-base', 'Pregătire standard', 24, 8, 8, 2),
        ]),

        course('A1', 'Motociclete de până la 125 cm³', '16 ani', 'Poligon și traseu', [
          plan('a1-base', 'Fără categoria AM', 24, 26, 60, 4),
          plan('a1-am-short', 'AM de cel mult 2 ani', 12, 20, 40, 3),
          plan('a1-am-long', 'AM de minimum 2 ani', 24, 10, 20, 3),
        ]),

        course('A2', 'Motociclete de până la 35 kW', '18 ani', 'Poligon și traseu', [
          plan('a2-base', 'Fără categoria A1', 24, 26, 60, 4),
          plan('a2-a1-short', 'A1 de cel mult 2 ani', 12, 20, 40, 3),
          plan('a2-a1-long', 'A1 de minimum 2 ani', 24, 10, 20, 3),
        ]),

        course(
          'A',
          'Motociclete fără limitarea de putere A2',
          '24 ani sau 20 ani cu minimum 2 ani A2',
          'Poligon și traseu',
          [
            plan('a-base', 'Fără categoria A2', 24, 26, 60, 4),
            plan('a-a2-short', 'A2 de cel mult 2 ani', 12, 20, 40, 3),
            plan('a-a2-long', 'A2 de minimum 2 ani', 24, 10, 20, 3),
          ],
          'Accesul este condiționat de vârsta minimă legală.',
        ),

        course('B1', 'Cvadricicluri', '16 ani', 'Traseu', [
          plan('b1-base', 'Pregătire standard', 24, 30, 300, 4),
        ]),

        course('B', 'Autoturisme', '18 ani', 'Traseu', [
          plan('b-base', 'Pregătire standard', 24, 30, 300, 4),
        ]),
      ],
    }),

    defineField({
      name: 'documents',
      title: 'Documente necesare înscrierii',
      type: 'array',
      description: 'Lista generală afișată în selector.',

      of: [
        defineArrayMember({
          type: 'object',
          name: 'requiredDocument',
          title: 'Document',
          fields: [
            defineField({
              name: 'title',
              title: 'Denumire',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Explicație',
              type: 'text',
              rows: 2,
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
        }),
      ],

      initialValue: [
        ['Cerere de înscriere', 'Completată pentru categoria solicitată.'],
        ['Act de identitate', 'Copie a documentului de identitate.'],
        ['Certificat medical „apt”', 'Pentru categoria solicitată, de la o unitate autorizată.'],
        ['Aviz psihologic „apt”', 'Evaluarea psihologică obligatorie, în original.'],
        [
          'Cazier judiciar sau declarație',
          'Conform variantei permise de metodologia de înscriere.',
        ],
        ['Permis existent', 'Copie, dacă deții deja un permis.'],
        ['Documente suplimentare', 'După caz, pentru situațiile speciale prevăzute de lege.'],
      ].map(([title, description], index) => ({
        _type: 'requiredDocument',
        _key: `document-${index + 1}`,
        title,
        description,
      })),
    }),
  ],

  preview: {
    select: {
      title: 'title',
    },
  },
})
