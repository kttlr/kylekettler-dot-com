import {defineCollection, z } from "astro:content";

export const collections ={
  projects: defineCollection({
    schema: ({image}) =>
      z.object({
        date: z.date(),
        image: image(),
        title: z.string(),
        description: z.string(),
        featured: z.boolean(),
        technologies: z.array(z.string()),
      })
  }),
  posts: defineCollection({
    schema: ({image}) =>
      z.object({
        title: z.string(),
        description: z.string(),
        date: z.date(),
        image: image().optional(),
      })
  })
}
