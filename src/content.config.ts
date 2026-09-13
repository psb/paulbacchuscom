import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from "astro/zod";

const blogPosts = defineCollection({
  loader: glob({ pattern: ["**/*.md", "**/*.mdx"], base: "./src/pages/blog" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.string(),
    day: z.number(),
    ordinal: z.string(),
    month: z.string(),
    year: z.number()
  })
});

export const collections = { blogPosts };