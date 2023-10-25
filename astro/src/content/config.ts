import {defineCollection, z } from "astro:content";

const projectsCollection = defineCollection({
  schema: ({image}) =>
    z.object({
      author: z.string(),
      date: z.string(),
      image: image(),
      title: z.string(),
  })
})

export const collections = {
  projects: projectsCollection
}
