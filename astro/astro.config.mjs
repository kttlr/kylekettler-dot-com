import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import { Resvg } from "@resvg/resvg-js";
import fs from "node:fs";
import satori from 'satori';
import parseFrontMatter from "gray-matter";
const render = title => ({
  type: "div",
  props: {
    style: {
      height: "100%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      backgroundColor: "##18181b",
      padding: "55px 70px",
      color: "#f4f4f5",
      fontFamily: "brockmann-semibold",
      fontSize: 72
    },
    children: [{
      type: "div",
      props: {
        children: title
      }
    }, {
      type: "div",
      props: {
        style: {
          fontSize: 36
        },
        children: "Kyle Kettler"
      }
    }]
  }
});
const og = () => ({
  name: "satori-og",
  hooks: {
    "astro:build:done": async ({
      dir,
      pages
    }) => {
      try {
        const brockmann = fs.readFileSync("public/fonts/brockmann-semibold.woff");

        //Generate images for Projects
        for (const {
          pathname
        } of pages) {
          if (!pathname.startsWith("projects/") || pathname.startsWith("projects/images")) {
            continue;
          }
          const file = fs.readFileSync(`src/content/projects/${pathname.slice(9, -1)}.mdx`);
          const {
            title
          } = parseFrontMatter(file).data;
          const svg = await satori(render(title), {
            width: 1200,
            height: 630,
            fonts: [{
              name: "brokcmann-semibold",
              data: brockmann,
              style: "normal"
            }]
          });
          const resvg = new Resvg(svg, {
            fitTo: {
              mode: "width",
              value: 1200
            }
          });
          fs.writeFileSync(`${dir.pathname}${pathname}og.png`, resvg.render().asPng());
        }
        // Generate images for Posts
        for (const {
          pathname
        } of pages) {
          if (!pathname.startsWith("posts/") || pathname.startsWith("posts/images")) {
            continue;
          }
          const file = fs.readFileSync(`src/content/posts/${pathname.slice(6, -1)}.mdx`);
          const {
            title
          } = parseFrontMatter(file).data;
          const svg = await satori(render(title), {
            width: 1200,
            height: 630,
            fonts: [{
              name: "brokcmann-semibold",
              data: brockmann,
              style: "normal"
            }]
          });
          const resvg = new Resvg(svg, {
            fitTo: {
              mode: "width",
              value: 1200
            }
          });
          fs.writeFileSync(`${dir.pathname}${pathname}og.png`, resvg.render().asPng());
        }
        console.log(`\x1b[32mog:\x1b[0m Generated OpenGraph images\n`);
      } catch (e) {
        console.error(e);
        console.log(`\x1b[31mog:\x1b[0m OpenGraph image generation failed\n`);
      }
    }
  }
});


// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react(), mdx(), og()],
  site: "https://kylekettler.com"
});