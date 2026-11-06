import {defineArrayMember, defineField, defineType} from 'sanity'

export const faqType = defineType({
  name: 'faq',
  title: 'Întrebări frecvente',
  type: 'document',
  description: 'Gestionează întrebările și răspunsurile afișate pe site.',

  fields: [
    defineField({
      name: 'title',
      title: 'Titlul secțiunii',
      type: 'string',
      initialValue: 'Întrebări frecvente',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Descrierea secțiunii',
      type: 'text',
      rows: 2,
      initialValue: 'Răspunsuri la cele mai comune întrebări despre cursuri și înscriere.',
    }),

    defineField({
      name: 'questions',
      title: 'Întrebări și răspunsuri',
      type: 'array',
      description: 'Adaugă, elimină sau reordonează întrebările.',
      validation: (Rule) => Rule.required().min(1),

      of: [
        defineArrayMember({
          name: 'faqItem',
          title: 'Întrebare',
          type: 'object',

          fields: [
            defineField({
              name: 'question',
              title: 'Întrebare',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'answer',
              title: 'Răspuns',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),
          ],

          preview: {
            select: {
              title: 'question',
              subtitle: 'answer',
            },
          },
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
    },
  },
})
