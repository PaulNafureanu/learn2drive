import {defineConfig, defineSingleton} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Learn2Drive',

  projectId: 'j4xqsgx8',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },

  document: {
    singletons: [
      defineSingleton({
        schemaType: 'siteSettings',
        documentId: 'siteSettings',
        title: 'Setări generale',
      }),

      defineSingleton({
        schemaType: 'navBar',
        documentId: 'navBar',
        title: 'Meniu de navigare',
      }),

      defineSingleton({
        schemaType: 'hero',
        documentId: 'hero',
        title: 'Secțiunea principală',
      }),

      defineSingleton({
        schemaType: 'faq',
        documentId: 'faq',
        title: 'Întrebări frecvente',
      }),

      defineSingleton({
        schemaType: 'reviews',
        documentId: 'reviews',
        title: 'Recenzii și testimoniale',
      }),

      defineSingleton({
        schemaType: 'about',
        documentId: 'about',
        title: 'Despre noi',
      }),

      defineSingleton({
        schemaType: 'courseGuide',
        documentId: 'courseGuide',
        title: 'Categorii și cerințe',
      }),
    ],
  },
})
