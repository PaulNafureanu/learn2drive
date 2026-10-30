import {defineField, defineType} from 'sanity'

export const heroType = defineType({
  name: 'hero',
  title: 'Secțiunea principală',
  type: 'document',

  description: 'Gestionează prima secțiune afișată pe pagina principală a site-ului.',

  fields: [
    defineField({
      name: 'title',
      title: 'Titlul principal',
      type: 'string',
      description:
        'Introdu prima parte a titlului mare afișat pe pagina principală. Exemplu: „Învață să conduci cu”.',
      validation: (Rule) => Rule.required().error('Titlul principal este obligatoriu.'),
    }),

    defineField({
      name: 'highlight',
      title: 'Textul evidențiat',
      type: 'string',
      description: 'Această parte a titlului va fi evidențiată cu albastru. Exemplu: „încredere.”',
    }),

    defineField({
      name: 'description',
      title: 'Descrierea secțiunii',
      type: 'text',
      rows: 3,
      description:
        'Scrie un mesaj scurt despre școala de șoferi, care va apărea sub titlul principal.',
    }),

    defineField({
      name: 'image',
      title: 'Imaginea principală',
      type: 'image',
      description:
        'Încarcă o fotografie reprezentativă pentru școala de șoferi. Recomandăm o imagine clară, de calitate bună, cu mașina școlii.',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Descrierea imaginii (accesibilitate)',
          type: 'string',
          description:
            'Descrie pe scurt ce apare în fotografie. Exemplu: „Mașină de școală de șoferi pe un drum din Onești”.',
        }),
      ],
    }),

    defineField({
      name: 'primaryButton',
      title: 'Butonul principal',
      type: 'object',
      description: 'Configurează butonul albastru care îndeamnă vizitatorii să se înscrie.',
      fields: [
        defineField({
          name: 'label',
          title: 'Textul butonului',
          type: 'string',
          description: 'Exemplu: „Înscrie-te acum”.',
        }),
        defineField({
          name: 'href',
          title: 'Destinația butonului',
          type: 'string',
          description:
            'Introdu adresa paginii sau a secțiunii către care duce butonul. Exemplu: #contact.',
        }),
      ],
    }),

    defineField({
      name: 'secondaryButton',
      title: 'Butonul secundar',
      type: 'object',
      description: 'Configurează al doilea buton, folosit pentru a prezenta cursurile disponibile.',
      fields: [
        defineField({
          name: 'label',
          title: 'Textul butonului',
          type: 'string',
          description: 'Exemplu: „Descoperă cursurile”.',
        }),
        defineField({
          name: 'href',
          title: 'Destinația butonului',
          type: 'string',
          description:
            'Introdu adresa paginii sau a secțiunii către care duce butonul. Exemplu: #cursuri.',
        }),
      ],
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
      media: 'image',
    },
    prepare({title, subtitle, media}) {
      return {
        title: title || 'Secțiunea principală',
        subtitle: subtitle || 'Conținutul primei secțiuni a site-ului',
        media,
      }
    },
  },
})
