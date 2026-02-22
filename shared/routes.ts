import { z } from 'zod';
import { insertOrderSchema, orders, songs, siteContent, insertSongSchema, insertContentSchema } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  orders: {
    create: {
      method: 'POST' as const,
      path: '/api/orders' as const,
      input: insertOrderSchema,
      responses: {
        201: z.custom<typeof orders.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    list: {
      method: 'GET' as const,
      path: '/api/orders' as const,
      responses: {
        200: z.array(z.custom<typeof orders.$inferSelect>()),
      },
    }
  },
  songs: {
    list: {
      method: 'GET' as const,
      path: '/api/songs' as const,
      responses: {
        200: z.array(z.custom<typeof songs.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/songs' as const,
      input: insertSongSchema,
      responses: {
        201: z.custom<typeof songs.$inferSelect>(),
      },
    }
  },
  content: {
    list: {
      method: 'GET' as const,
      path: '/api/content' as const,
      responses: {
        200: z.array(z.custom<typeof siteContent.$inferSelect>()),
      },
    },
    update: {
      method: 'POST' as const,
      path: '/api/content' as const,
      input: z.object({ key: z.string(), value: z.string() }),
      responses: {
        200: z.custom<typeof siteContent.$inferSelect>(),
      },
    }
  }
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type OrderInput = z.infer<typeof api.orders.create.input>;
export type OrderResponse = z.infer<typeof api.orders.create.responses[201]>;
export type OrdersListResponse = z.infer<typeof api.orders.list.responses[200]>;
export type SongResponse = z.infer<typeof api.songs.list.responses[200]>[number];
export type ContentResponse = z.infer<typeof api.content.list.responses[200]>[number];
