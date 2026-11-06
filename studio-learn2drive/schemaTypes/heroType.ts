import {defineArrayMember, defineField, defineType} from 'sanity'

export const heroType = defineType({
  name: 'hero',
  title: 'Secțiunea principală',
  type: 'document',
  description: 'Personalizează prima secțiune a paginii principale.',

  fields: [
    defineField({
      name: 'title',
      title: 'Titlul principal',
      type: 'string',
      description: 'Prima parte a titlului.',
      initialValue: 'Învață să conduci cu',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'highlight',
      title: 'Text evidențiat',
      type: 'string',
      description: 'Textul afișat în albastru după titlul principal.',
      initialValue: 'încredere.',
    }),

    defineField({
      name: 'description',
      title: 'Descrierea secțiunii',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.max(300),
    }),

    defineField({
      name: 'images',
      title: 'Imagini slideshow',
      type: 'array',
      description: 'Adaugă și reordonează fotografiile din slideshow.',

      of: [
        defineArrayMember({
          type: 'image',
          options: {hotspot: true},

          fields: [
            defineField({
              name: 'alt',
              title: 'Descrierea imaginii',
              type: 'string',
              description: 'Descrie fotografia pentru accesibilitate.',
            }),
          ],
        }),
      ],

      validation: (Rule) => Rule.max(8),
    }),

    defineField({
      name: 'primaryButton',
      title: 'Butonul principal',
      type: 'object',
      validation: (Rule) => Rule.required(),

      fields: [
        defineField({
          name: 'label',
          title: 'Textul butonului',
          type: 'string',
          initialValue: 'Înscrie-te acum',
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: 'href',
          title: 'Destinație',
          type: 'string',
          initialValue: '#contact',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),

    defineField({
      name: 'secondaryButton',
      title: 'Butonul secundar',
      type: 'object',
      validation: (Rule) => Rule.required(),

      fields: [
        defineField({
          name: 'label',
          title: 'Textul butonului',
          type: 'string',
          initialValue: 'Descoperă cursurile',
          validation: (Rule) => Rule.required(),
        }),

        defineField({
          name: 'href',
          title: 'Destinație',
          type: 'string',
          initialValue: '#cursuri',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      media: 'images.0',
    },
  },
})
