import { defineCollection, z } from "astro:content";

export const collections = {
  projects: defineCollection({
    schema: ({ image }) =>
      z.object({
        order: z.number().optional(),
        date: z.union([z.date(), z.string()]),
        image: image().optional(),
        title: z.string(),
        description: z.string(),
        role: z.string().optional(),
        featured: z.boolean(),
        stack: z.array(z.string()).optional(),
        additionalTech: z.array(z.string()).optional(),
        github: z.string().url().optional(),
        live: z.string().url().optional(),
      }),
  }),
  posts: defineCollection({
    schema: ({ image }) =>
      z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        image: image().optional(),
      }),
  }),
};
