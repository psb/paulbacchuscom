// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
// import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: 'https://www.paulbacchus.com',
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: "light-plus",
    },
  },

  fonts: [
    {
      provider: fontProviders.local(),
      name: "IBMPlexSans",
      cssVariable: "--font-ibm-plex-sans",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/IBMPlexSans-Regular.woff2"],
            weight: 400,
            style: "normal"
          },
          {
            src: ["./src/assets/fonts/IBMPlexSans-Bold.woff2"],
            weight: 700,
            style: "oblique"
          },
          {
            src: ["./src/assets/fonts/IBMPlexSans-Italic.woff2"],
            weight: 400,
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
            weight: 400,
            style: "normal"
          },
          {
            src: ["./src/assets/fonts/NebulaSans-BookItalic.woff2"],
            weight: 400,
            style: "italic"
          },
          {
            src: ["./src/assets/fonts/NebulaSans-Medium.woff2"],
            weight: 500,
            style: "normal"
          },
          {
            src: ["./src/assets/fonts/NebulaSans-MediumItalic.woff2"],
            weight: 500,
            style: "italic"
          },
          {
            src: ["./src/assets/fonts/NebulaSans-Semibold.woff2"],
            weight: 600,
            style: "normal"
          },
          {
            src: ["./src/assets/fonts/NebulaSans-SemiboldItalic.woff2"],
            weight: 600,
            style: "italic"
          },
          {
            src: ["./src/assets/fonts/NebulaSans-Bold.woff2"],
            weight: 700,
            style: "normal"
          },
          {
            src: ["./src/assets/fonts/NebulaSans-BoldItalic.woff2"],
            weight: 700,
            style: "italic"
          },
          {
            src: ["./src/assets/fonts/NebulaSans-Black.woff2"],
            weight: 900,
            style: "normal"
          },
          {
            src: ["./src/assets/fonts/NebulaSans-BlackItalic.woff2"],
            weight: 900,
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
            weight: 400,
            style: "normal"
          },
        ]
      }
    },
    {
      provider: fontProviders.local(),
      name: "Geist",
      cssVariable: "--font-geist",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/Geist[wght].woff2"],
            weight: "400 700 900",
            style: "normal"
          },
          {
            src: ["./src/assets/fonts/Geist-Italic[wght].woff2"],
            weight: "400 700 900",
            style: "italic"
          },
        ]
      }
    },
    {
      provider: fontProviders.local(),
      name: "Geist",
      cssVariable: "--font-geist-mono",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/GeistMono-Regular.woff2"],
            weight: 400,
            style: "normal"
          },
        ]
      }
    },
    {
      provider: fontProviders.local(),
      name: "Geist",
      cssVariable: "--font-geist-pixel-circle",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/GeistPixel-Circle.woff2"],
            weight: 400,
            style: "normal"
          },
        ]
      }
    },
    {
      provider: fontProviders.local(),
      name: "Caveat",
      cssVariable: "--font-caveat",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/caveat-regular-webfont.woff"],
            weight: 400,
            style: "normal"
          },
          {
            src: ["./src/assets/fonts/caveat-bold-webfont.woff"],
            weight: 700,
            style: "normal"
          },
        ]
      }
    },
  ],

  // vite: {
  //   plugins: [tailwindcss()],
  // },
});