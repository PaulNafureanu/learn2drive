import {defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Setări generale',
  type: 'document',
  description: 'Personalizează identitatea școlii și setările SEO ale site-ului.',

  fields: [
    defineField({
      name: 'schoolName',
      title: 'Numele școlii',
      type: 'string',
      initialValue: 'LEARN2DRIVE',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'logo',
      title: 'Logo-ul școlii',
      type: 'image',
      description:
        'Opțional. Încarcă o variantă a logo-ului. Dacă nu încarci nimic, va apărea numele școlii.',
      options: {hotspot: true},
    }),

    defineField({
      name: 'seo',
      title: 'SEO & Google',
      type: 'object',
      description: 'Personalizează modul în care site-ul apare în Google și pe rețelele sociale.',

      fields: [
        defineField({
          name: 'title',
          title: 'Titlul paginii',
          type: 'string',
          description: 'Titlul afișat în rezultatele Google și în fila browserului.',
          validation: (Rule) => Rule.max(65),
        }),

        defineField({
          name: 'description',
          title: 'Descriere Google',
          type: 'text',
          rows: 3,
          description: 'Descrierea paginii în rezultatele motoarelor de căutare.',
          validation: (Rule) => Rule.max(160),
        }),

        defineField({
          name: 'socialImage',
          title: 'Imagine pentru distribuire',
          type: 'image',
          description: 'Imaginea folosită la distribuirea site-ului pe Facebook, WhatsApp etc.',
          options: {hotspot: true},
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'schoolName',
      media: 'logo',
    },
  },
})
