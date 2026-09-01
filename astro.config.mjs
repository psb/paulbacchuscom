// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
// import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: 'https://www.paulbacchus.com',
  integrations: [mdx()],

  fonts: [
    {
      provider: fontProviders.local(),
      name: "IBMPlexSans",
      cssVariable: "--font-ibm-plex-sans",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/IBMPlexSans-Regular.woff2"],
            weight: "normal",
            style: "normal"
          },
          {
            src: ["./src/assets/fonts/IBMPlexSans-Bold.woff2"],
            weight: "normal",
            style: "oblique"
          },
          {
            src: ["./src/assets/fonts/IBMPlexSans-Italic.woff2"],
            weight: "normal",
            style: "italic"
          },
        ]
      }
    },
    {
      provider: fontProviders.local(),
      name: "NebulaSans",
      cssVariable: "--font-nebula-sans",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/NebulaSans-Book.woff2"],
            weight: "normal",
            style: "normal"
          },
          {
            src: ["./src/assets/fonts/NebulaSans-Bold.woff2"],
            weight: "normal",
            style: "oblique"
          },
          {
            src: ["./src/assets/fonts/NebulaSans-BookItalic.woff2"],
            weight: "normal",
            style: "italic"
          },
          {
            src: ["./src/assets/fonts/NebulaSans-Medium.woff2"],
            weight: "medium",
            style: "normal"
          },
          {
            src: ["./src/assets/fonts/NebulaSans-MediumItalic.woff2"],
            weight: "medium",
            style: "italic"
          },
        ]
      }
    },
    {
      provider: fontProviders.local(),
      name: "JetBrainsMono",
      cssVariable: "--font-jet-brains-mono",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/JetBrainsMono-Regular.woff2"],
            weight: "normal",
            style: "normal"
          },
        ]
      }
    }
  ],

  // vite: {
  //   plugins: [tailwindcss()],
  // },
});