import {defineArrayMember, defineField, defineType} from 'sanity'

export const aboutType = defineType({
  name: 'about',
  title: 'Despre noi și pașii către permis',
  type: 'document',
  description: 'Prezentarea școlii și etapele pregătirii cursanților.',

  fields: [
    defineField({
      name: 'title',
      title: 'Titlul principal',
      type: 'string',
      initialValue: 'De la primele emoții la',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'highlight',
      title: 'Text evidențiat',
      type: 'string',
      initialValue: 'libertatea de a conduce.',
      description: 'Textul care va apărea în albastru.',
    }),

    defineField({
      name: 'steps',
      title: 'Etapele pregătirii',
      type: 'array',
      description: 'Adaugă și reordonează etapele afișate pe site.',
      validation: (Rule) => Rule.required().min(1).max(6),

      of: [
        defineArrayMember({
          name: 'roadmapStep',
          title: 'Etapă',
          type: 'object',

          fields: [
            defineField({
              name: 'title',
              title: 'Titlul etapei',
              type: 'string',
              validation: (Rule) => Rule.required().max(50),
            }),

            defineField({
              name: 'description',
              title: 'Descriere',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required().max(220),
            }),

            defineField({
              name: 'icon',
              title: 'Pictogramă',
              type: 'string',
              initialValue: 'car',
              options: {
                list: [
                  {title: 'Înscriere', value: 'clipboard'},
                  {title: 'Teorie', value: 'book'},
                  {title: 'Conducere', value: 'car'},
                  {title: 'Examen', value: 'award'},
                  {title: 'Permis', value: 'license'},
                  {title: 'Încredere', value: 'shield'},
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
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
        {
          _type: 'roadmapStep',
          _key: 'registration',
          title: 'Înscrierea',
          description:
            'Ne contactezi, afli informațiile necesare și pregătești documentele pentru înscriere.',
          icon: 'clipboard',
        },
        {
          _type: 'roadmapStep',
          _key: 'theory',
          title: 'Pregătirea teoretică',
          description:
            'Înveți regulile de circulație și elementele esențiale pentru siguranța rutieră.',
          icon: 'book',
        },
        {
          _type: 'roadmapStep',
          _key: 'practice',
          title: 'Orele de conducere',
          description:
            'Exersezi alături de instructor, îți dezvolți reflexele și câștigi încredere.',
          icon: 'car',
        },
        {
          _type: 'roadmapStep',
          _key: 'exam',
          title: 'Examenul',
          description:
            'După finalizarea pregătirii și îndeplinirea condițiilor, urmează susținerea examenului.',
          icon: 'award',
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'roadmapTitle',
    },
  },
})
