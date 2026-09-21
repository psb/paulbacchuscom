---
title: "Getting Started with ReasonReact and Melange"
description: "Getting Started with ReasonReact and Melange."
pubDate: "2023-07-07"
day: 7
ordinal: "th"
month: "July"
year: 2023
coverImage: "../assets/images/2023-07-07/2023-07-07-Getting-Started-with-ReasonReact-and-Melange.webp"
coverImageAlt: "Reason"
---
## A bit of background

To quote the official docs:

> Melange is a backend for the OCaml compiler that emits JavaScript. Melange strives to provide the best integration with both the OCaml and JavaScript ecosystems.

Basically, [Melange](https://melange.re/v1.0.0/) lets you generate JS code from OCaml code. [Reason](https://reasonml.github.io/en) (aka ReasonML) is an alternative syntax for OCaml that looks more like JS. [Reason React](https://reasonml.github.io/reason-react/en) are Reason bindings to React so that you can create React apps with Reason.

You may have heard of BuckleScript and you may be wondering if there is a relationship between Melange and BuckleScript. To quote the docs again:

> ... at some point the goals of both BuckleScript and Reason projects become harder to reconcile. In August 2020, the BuckleScript team decides to rename to ReScript, stops adding support for the latest versions of the Reason parser, and replaces it with a new parser that changes the syntax. The reasons for the rebranding are explained in [the official ReScript blog post](https://rescript-lang.org/blog/bucklescript-is-rebranding).
...
> This is where Melange comes in. A few weeks after the rebranding of BuckleScript to ReScript, António Monteiro starts working on a fork of BuckleScript with a simple (not easy) goal: replace the Ninja build system, which BuckleScript had been using from its creation, with Dune, which is the most used build system for OCaml projects.

Melange has reached a [1.0 release](https://anmonteiro.substack.com/p/melange-10-is-here), and it is [used in production](https://tech.ahrefs.com/ahrefs-is-now-built-with-melange-b14f5ec56df4) at [Ahrefs](https://ahrefs.com). [server-reason-react](https://sancho.dev/blog/server-side-rendering-react-in-ocaml), which was discussed by [ThePrimeagen](https://www.youtube.com/watch?v=j9Vn6PC2u8k), is a great article that shows what Melange, Reason/OCaml and ReasonReact can do.


## Reading

If you know nothing about OCaml and its ecosystem the [new(ish) docs](https://ocaml.org/docs/up-and-running) are a great place to start. I would then spend some time going over the [Melange docs](https://melange.re/v1.0.0/) which explain how to set everything up and JS interop. If you know JS then the syntax in the [Reason docs](https://ocaml.org/docs/up-and-running) should not be too alien. And if you know React then it should not take long to go over the [ReasonReact docs](https://reasonml.github.io/reason-react/docs/en/installation).


## Quick start templates

- A template using both OCaml and Reason syntax, ReasonReact and webpack: https://github.com/melange-re/melange-opam-template.
- A template using both OCaml and Reason syntax, ReasonReact and Vite: https://github.com/pdelacroix/melange-vite-template
- A template using only Reason syntax, ReasonReact, Tailwind and Vite: https://github.com/psb/melange-opam-template.


## Example apps

[Here](https://github.com/psb/reason-react-hn-melange) is a Hacker News app that uses ReasonReact and Tailwind. It is a port of the original app that used BuckleScript. A good exercise for the reader would be to update the app to use the official HN API.

Because Melange outputs JS you can sprinkle Reason and ReasonReact into existing JS apps. [Here](https://github.com/psb/astro-reason) is an example [Astro](https://docs.astro.build/) application that uses ReasonReact components and Reason lambda functions on [Netlify](https://www.netlify.com/). I'll admit that it did take a while to figure out how to get everything setup properly so that everything worked together, but now you don't have to 😁. Check out the open and closed issues in the repo to see what kind of problems I was having.


## Getting help

Hopefully the docs and example apps can get you up and running with Melange, Reason and ReasonReact, but if you need further help then the [Reason Discord channel](https://discord.gg/reasonml) is a great place to get help. I owe thanks to [António Monteiro](https://twitter.com/_anmonteiro), [Javier Chávarri](https://twitter.com/javierwchavarri), [David Sancho](https://twitter.com/davesnx) and [Dimitris Mostrous](https://medium.com/@mostrous) for helping me. Pop in and say hi 👋. There is also the [Reason forum](https://reasonml.chat/).

You can get help with OCaml and OCaml tooling in the Reason Discord but there are more OCaml people in the [OCaml Discord channel](https://discord.gg/cCYQbqN) and [OCaml forum](https://discuss.ocaml.org/).


## Next

So far I have really enjoyed working with this stack. The compiler is incredibly fast, the type system and tooling are great, and Reason can fit in to the typical JS workflow. I still have some experiments I want to do with ReasonReact (e.g., using third party React components), but I hope to be able to play with [Dream](https://aantron.github.io/dream/) soon and build some full stack applications. Type safety from the DB to the frontend would be great!