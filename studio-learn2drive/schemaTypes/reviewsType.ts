import {defineArrayMember, defineField, defineType} from 'sanity'

export const reviewsType = defineType({
  name: 'reviews',
  title: 'Recenzii și testimoniale',
  type: 'document',
  description: 'Gestionează testimonialele pentru care școala are permisiunea de publicare.',

  fields: [
    defineField({
      name: 'title',
      title: 'Titlul secțiunii',
      type: 'string',
      initialValue: 'Ce spun cursanții noștri?',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Descrierea secțiunii',
      type: 'text',
      rows: 2,
      initialValue: 'Descoperă experiențele cursanților LEARN2DRIVE.',
    }),

    defineField({
      name: 'testimonials',
      title: 'Testimoniale',
      type: 'array',
      description: 'Adaugă doar testimoniale autentice, cu permisiunea autorilor.',

      of: [
        defineArrayMember({
          name: 'testimonial',
          title: 'Testimonial',
          type: 'object',

          fields: [
            defineField({
              name: 'author',
              title: 'Numele autorului',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'rating',
              title: 'Evaluare',
              type: 'number',
              initialValue: 5,
              validation: (Rule) => Rule.required().integer().min(1).max(5),
            }),

            defineField({
              name: 'text',
              title: 'Testimonial',
              type: 'text',
              rows: 4,
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'date',
              title: 'Data testimonialului',
              type: 'date',
            }),
          ],

          preview: {
            select: {
              title: 'author',
              subtitle: 'text',
            },
          },
        }),
      ],

      validation: (Rule) => Rule.max(12),
    }),
  ],

  preview: {
    select: {
      title: 'title',
    },
  },
})
