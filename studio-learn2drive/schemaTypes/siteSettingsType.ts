import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Setări generale',
  type: 'document',
  description: 'Informații generale despre școală, contact, locație și SEO.',

  groups: [
    {name: 'identity', title: 'Identitate', default: true},
    {name: 'contact', title: 'Contact'},
    {name: 'social', title: 'Social Media'},
    {name: 'location', title: 'Locație'},
    {name: 'seo', title: 'SEO & Google'},
  ],

  fields: [
    // ==========================================
    // IDENTITY
    // ==========================================

    defineField({
      name: 'schoolName',
      title: 'Numele școlii',
      type: 'string',
      group: 'identity',
      initialValue: 'LEARN2DRIVE',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'logo',
      title: 'Logo-ul școlii',
      type: 'image',
      group: 'identity',
      description: 'Opțional. Dacă nu încarci un logo, se va folosi varianta implicită.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Text alternativ',
          type: 'string',
        }),
      ],
    }),

    defineField({
      name: 'shortDescription',
      title: 'Scurtă descriere',
      type: 'text',
      rows: 3,
      group: 'identity',
      description: 'O scurtă prezentare a școlii pentru footer sau pagina de contact.',
      validation: (Rule) => Rule.max(300),
    }),

    // ==========================================
    // CONTACT
    // ==========================================

    defineField({
      name: 'phone',
      title: 'Număr de telefon',
      type: 'string',
      group: 'contact',
      description: 'Recomandat în format internațional, de exemplu +407XXXXXXXX.',
      validation: (Rule) =>
        Rule.regex(/^\+?[0-9\s().-]{7,20}$/, {
          name: 'număr de telefon',
          invert: false,
        }).error('Introdu un număr de telefon valid.'),
    }),

    defineField({
      name: 'whatsapp',
      title: 'Număr WhatsApp',
      type: 'string',
      group: 'contact',
      description: 'Opțional. Numărul folosit pentru contact prin WhatsApp.',
      validation: (Rule) =>
        Rule.regex(/^\+?[0-9\s().-]{7,20}$/).error('Introdu un număr WhatsApp valid.'),
    }),

    defineField({
      name: 'email',
      title: 'Adresă de email',
      type: 'string',
      group: 'contact',
      validation: (Rule) => Rule.email(),
    }),

    // ==========================================
    // SOCIAL MEDIA
    // ==========================================

    defineField({
      name: 'socialLinks',
      title: 'Linkuri social media și website-uri',
      type: 'array',
      group: 'social',
      description: 'Adaugă linkuri către rețelele sociale sau alte website-uri.',

      of: [
        defineArrayMember({
          name: 'socialLink',
          title: 'Link extern',
          type: 'object',

          fields: [
            defineField({
              name: 'platform',
              title: 'Platformă',
              type: 'string',
              options: {
                list: [
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  {title: 'WhatsApp', value: 'whatsapp'},
                  {title: 'Alt website', value: 'website'},
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'label',
              title: 'Nume afișat',
              type: 'string',
              description: 'Exemplu: LEARN2DRIVE pe Facebook.',
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'url',
              title: 'Link',
              type: 'url',
              validation: (Rule) =>
                Rule.required().uri({
                  scheme: ['https'],
                }),
            }),
          ],

          preview: {
            select: {
              title: 'label',
              subtitle: 'url',
            },
          },
        }),
      ],
    }),

    // ==========================================
    // LOCATION
    // ==========================================

    defineField({
      name: 'address',
      title: 'Adresa școlii',
      type: 'object',
      group: 'location',
      description: 'Adresa fizică a sediului școlii.',

      fields: [
        defineField({
          name: 'street',
          title: 'Stradă și număr',
          type: 'string',
        }),

        defineField({
          name: 'city',
          title: 'Oraș / Localitate',
          type: 'string',
        }),

        defineField({
          name: 'county',
          title: 'Județ',
          type: 'string',
        }),

        defineField({
          name: 'postalCode',
          title: 'Cod poștal',
          type: 'string',
        }),

        defineField({
          name: 'country',
          title: 'Țară',
          type: 'string',
          initialValue: 'România',
        }),
      ],
    }),

    defineField({
      name: 'googleMapsUrl',
      title: 'Link Google Maps',
      type: 'url',
      group: 'location',
      description: 'Opțional. Linkul de distribuire către locația școlii din Google Maps.',
      validation: (Rule) => Rule.uri({scheme: ['https']}),
    }),

    defineField({
      name: 'googleMapsEmbedUrl',
      title: 'Google Maps - Hartă încorporată',
      type: 'url',
      group: 'location',
      description:
        'Deschide locația școlii în Google Maps → Distribuie → Încorporează o hartă. Copiază doar URL-ul din atributul src al iframe-ului.',
      validation: (Rule) =>
        Rule.uri({scheme: ['https']}).custom((url) => {
          if (!url) return true

          try {
            const parsed = new URL(url)

            return (
              (parsed.hostname === 'www.google.com' && parsed.pathname.startsWith('/maps/embed')) ||
              'Introdu un link de încorporare Google Maps valid.'
            )
          } catch {
            return 'URL invalid.'
          }
        }),
    }),

    defineField({
      name: 'openingHours',
      title: 'Program de funcționare',
      type: 'array',
      group: 'location',
      description: 'Programul obișnuit al școlii.',

      of: [
        defineArrayMember({
          name: 'openingHoursItem',
          title: 'Program zilnic',
          type: 'object',

          fields: [
            defineField({
              name: 'day',
              title: 'Ziua săptămânii',
              type: 'string',
              options: {
                list: [
                  {title: 'Luni', value: 'Luni'},
                  {title: 'Marți', value: 'Marți'},
                  {title: 'Miercuri', value: 'Miercuri'},
                  {title: 'Joi', value: 'Joi'},
                  {title: 'Vineri', value: 'Vineri'},
                  {title: 'Sâmbătă', value: 'Sâmbătă'},
                  {title: 'Duminică', value: 'Duminică'},
                ],
              },
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: 'closed',
              title: 'Închis',
              type: 'boolean',
              initialValue: false,
            }),

            defineField({
              name: 'opens',
              title: 'Ora deschiderii',
              type: 'string',
              description: 'Format HH:mm, de exemplu 09:00.',
              hidden: ({parent}) => parent?.closed === true,
              validation: (Rule) =>
                Rule.regex(/^([01]\d|2[0-3]):[0-5]\d$/).error('Folosește formatul HH:mm.'),
            }),

            defineField({
              name: 'closes',
              title: 'Ora închiderii',
              type: 'string',
              description: 'Format HH:mm, de exemplu 17:00.',
              hidden: ({parent}) => parent?.closed === true,
              validation: (Rule) =>
                Rule.regex(/^([01]\d|2[0-3]):[0-5]\d$/).error('Folosește formatul HH:mm.'),
            }),
          ],

          preview: {
            select: {
              title: 'day',
              opens: 'opens',
              closes: 'closes',
              closed: 'closed',
            },
            prepare({title, opens, closes, closed}) {
              return {
                title,
                subtitle: closed
                  ? 'Închis'
                  : opens && closes
                    ? `${opens} - ${closes}`
                    : 'Program nespecificat',
              }
            },
          },
        }),
      ],
    }),

    // ==========================================
    // SEO
    // ==========================================

    defineField({
      name: 'seo',
      title: 'SEO & Google',
      type: 'object',
      group: 'seo',
      description: 'Personalizează modul în care site-ul apare în Google și pe rețelele sociale.',

      fields: [
        defineField({
          name: 'title',
          title: 'Titlul paginii',
          type: 'string',
          validation: (Rule) => Rule.max(65),
        }),

        defineField({
          name: 'description',
          title: 'Descriere Google',
          type: 'text',
          rows: 3,
          validation: (Rule) => Rule.max(160),
        }),

        defineField({
          name: 'socialImage',
          title: 'Imagine pentru distribuire',
          type: 'image',
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
