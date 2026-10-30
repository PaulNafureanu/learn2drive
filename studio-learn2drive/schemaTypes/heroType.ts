import {defineField, defineType} from 'sanity'

export const heroType = defineType({
  name: 'hero',
  title: 'Homepage Hero',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Main Heading',
      type: 'string',
      description: 'The main heading displayed on the homepage.',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'highlight',
      title: 'Highlighted Heading',
      type: 'string',
      description: 'Text that appears in blue.',
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),

    defineField({
      name: 'image',
      title: 'Hero Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Image Description',
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'primaryButton',
      title: 'Primary Button',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Button Text',
          type: 'string',
        }),
        defineField({
          name: 'href',
          title: 'Button Link',
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'secondaryButton',
      title: 'Secondary Button',
      type: 'object',
      fields: [
        defineField({
          name: 'label',
          title: 'Button Text',
          type: 'string',
        }),
        defineField({
          name: 'href',
          title: 'Button Link',
          type: 'string',
        }),
      ],
    }),
  ],
})
