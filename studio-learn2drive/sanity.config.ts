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
    ],
  },
})
