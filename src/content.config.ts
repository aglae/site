import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const translationInfo = z.object({
  method: z.enum(['ai', 'human']),
  reviewed: z.boolean().default(false),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    treeState: z.enum(['hanging', 'crooked', 'fallen']),
    type: z.enum(['thought', 'note', 'reflection', 'essay']),
    themes: z.array(z.string()).default([]),
    originalLanguage: z.enum(['en', 'es']),
    translation: z
      .object({
        en: translationInfo.optional(),
        es: translationInfo.optional(),
      })
      .optional(),
    manualEchoes: z.array(z.string()).default([]),
    firstLeft: z.coerce.date(),
    lastDisturbed: z.coerce.date(),
    spoilers: z.string().default('none'),
  }),
});

const design = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/design' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    year: z.string().optional(),
    themes: z.array(z.string()).default([]),
    order: z.number().default(0),
  }),
});

export const collections = { writing, design };
