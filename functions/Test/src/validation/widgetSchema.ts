import { z } from 'zod';

// Zod schema for AppwriteDocument
export const AppwriteDocumentSchema = z.object({
  $id: z.string(),
  $collectionId: z.string(),
  $databaseId: z.string(),
  $createdAt: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: 'Invalid ISO date',
  }),
  $updatedAt: z.string().refine((v) => !isNaN(Date.parse(v)), {
    message: 'Invalid ISO date',
  }),
  $permissions: z.array(z.string()),
  $sequence: z.number(),
});

// Zod schema for Widget (extends AppwriteDocument)
export const WidgetSchema = AppwriteDocumentSchema.extend({
  weight: z.number(),
  color: z.enum(['red', 'blue', 'gold']),
});

export type WidgetInput = z.infer<typeof WidgetSchema>;
