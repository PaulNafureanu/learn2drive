import {defineArrayMember, defineField, defineType} from 'sanity'

export const navBarType = defineType({
  name: 'navBar',
  title: 'Meniu de navigare',
  type: 'document',
  description: 'Personalizează meniul de navigare al site-ului.',

  fields: [
    defineField({
      name: 'navigation',
      title: 'Linkuri de navigare',
      type: 'array',
      description: 'Adaugă, elimină sau reordonează linkurile.',

      validation: (Rule) => Rule.required().min(1),

      of: [
        defineArrayMember({
          name: 'navigationItem',
          title: 'Link de navigare',
          type: 'object',

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
              description: 'Exemplu: #acasa, #cursuri sau #contact.',
              validation: (Rule) =>
                Rule.custom((href, context) => {
                  const parent = context.parent as
                    | {
                        children?: unknown[]
                      }
                    | undefined

                  if (!href && !parent?.children?.length) {
                    return 'Adaugă o destinație sau cel puțin un sublink.'
                  }

                  return true
                }),
            }),

            defineField({
              name: 'children',
              title: 'Sublinkuri (Dropdown)',
              type: 'array',
              description: 'Linkuri afișate în meniul dropdown.',

              of: [
                defineArrayMember({
                  name: 'subNavigationItem',
                  title: 'Sublink',
                  type: 'object',

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
            }),
          ],

          preview: {
            select: {
              title: 'label',
              subtitle: 'href',
              children: 'children',
            },

            prepare({title, subtitle, children}) {
              const count = Array.isArray(children) ? children.length : 0

              return {
                title,
                subtitle: count > 0 ? `${count} sublinkuri` : subtitle,
              }
            },
          },
        }),
      ],

      initialValue: [
        {
          _type: 'navigationItem',
          _key: 'home',
          label: 'Acasă',
          href: '#acasa',
        },
        {
          _type: 'navigationItem',
          _key: 'courses',
          label: 'Cursuri',
          href: '#cursuri',
          children: [
            {
              _type: 'subNavigationItem',
              _key: 'courseA',
              label: 'Curs A',
              href: '#curs-a',
            },
            {
              _type: 'subNavigationItem',
              _key: 'courseB',
              label: 'Curs B',
              href: '#curs-b',
            },
          ],
        },
        {
          _type: 'navigationItem',
          _key: 'about',
          label: 'Despre noi',
          href: '#despre',
        },
        {
          _type: 'navigationItem',
          _key: 'contact',
          label: 'Contact',
          href: '#contact',
        },
      ],
    }),
  ],

  preview: {
    prepare() {
      return {
        title: 'Meniu de navigare',
        subtitle: 'Setările meniului principal',
      }
    },
  },
})
