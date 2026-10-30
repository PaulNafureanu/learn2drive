import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Setări generale',
  type: 'document',
  description: 'Personalizează identitatea școlii, meniul și butonul principal.',

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
        'Opțional. Încarcă o variantă a logo-ului potrivită pentru bara de navigare. Dacă nu încarci nimic, va apărea numele școlii.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Descrierea logo-ului',
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'navigation',
      title: 'Meniul de navigare',
      type: 'array',
      description: 'Adaugă, elimină sau reordonează linkurile din meniul site-ului.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'navigationItem',
          title: 'Link de navigare',
          fields: [
            defineField({
              name: 'label',
              title: 'Text afișat',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'href',
              title: 'Destinație',
              type: 'string',
              description: 'Exemplu: #acasa, #cursuri, #despre sau #contact.',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'href',
            },
          },
        }),
      ],
      initialValue: [
        {_type: 'navigationItem', _key: 'home', label: 'Acasă', href: '#acasa'},
        {_type: 'navigationItem', _key: 'courses', label: 'Cursuri', href: '#cursuri'},
        {_type: 'navigationItem', _key: 'about', label: 'Despre noi', href: '#despre'},
        {_type: 'navigationItem', _key: 'contact', label: 'Contact', href: '#contact'},
      ],
    }),

    defineField({
      name: 'headerButton',
      title: 'Butonul din meniu',
      type: 'object',
      description: 'Butonul evidențiat în partea dreaptă a meniului.',
      fields: [
        defineField({
          name: 'label',
          title: 'Textul butonului',
          type: 'string',
          initialValue: 'Înscrie-te acum',
        }),
        defineField({
          name: 'href',
          title: 'Destinația butonului',
          type: 'string',
          initialValue: '#contact',
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
