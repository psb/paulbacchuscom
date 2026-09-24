// @ts-check
import { defineConfig, fontProviders } from "astro/config";
import mdx from "@astrojs/mdx";
import { transformerNotationHighlight, transformerNotationWordHighlight } from "@shikijs/transformers";
import alabaster from "./alabaster-color-theme.json";
import reasonGrammar from "./reason.json";

export default defineConfig({
  site: "https://www.paulbacchus.com",
  integrations: [mdx()],
  markdown: {
    shikiConfig: {
      theme: alabaster,
      transformers: [transformerNotationHighlight(), transformerNotationWordHighlight()],
      langs: [
        // @ts-ignore
        {
          ...reasonGrammar,
          name: "reason",
          scopeName: "source.reason",
          aliases: ["re", "rei", "reasonml"],
        },
      ]
    },
  },

  fonts: [
    {
      provider: fontProviders.local(),
      name: "InterVariable",
      cssVariable: "--font-inter-variable",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/InterVariable.woff2"],
            weight: "400 500 600 700 800 900",
            style: "normal"
          },
          {
            src: ["./src/assets/fonts/InterVariable-Italic.woff2"],
            weight: "400 500 600 700 800 900",
            style: "italic"
          },
        ]
      }
    },
    {
      provider: fontProviders.local(),
      name: "JetBrainsMonoRegular",
      cssVariable: "--font-jetbrains-mono-regular",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/JetBrainsMono-Regular.woff2"],
            weight: "400",
            style: "normal"
          },
        ]
      }
    },
  ],
});