---
title: "NextJs app folder and ReasonReact"
description: "Using NextJS app folder with ReasonReact."
pubDate: "2023-08-15"
day: 15
ordinal: "th"
month: "August"
year: 2023
coverImage: "../assets/images/2023-08-15/image.jpg"
coverImageAlt: "Computer says no"
---
## _TLDR_

![VyVyan cricket bat](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jml6mamzjlhhbdula6x7.gif)

After creating a [demo application](https://github.com/psb/astro-reason) with Astro and ReasonReact I thought I would try and recreate the app using NextJS and the App Router. In the Astro app components were written using ReasonReact and then imported into an Astro file from the output JS files created by Melange. This time I wanted to try and use no JS at all and write the whole thing in Reason. The code can be found [here](https://github.com/psb/nextjs-approuter-reason).

## The Dune way

### The `_build` folder

When Dune builds a projects the output is placed into the `_build` directory. For the Astro application mentioned above ReasonReact components were promoted out of the `_build` folder and back into the `src` folder, which made it easier to import the components into `.astro` files. Because NextJS uses folder based routing I wanted to try and keep the directory structure as clean as possible and without promoted folders, thus making the directory structure the same as a regular JavaScript NextJS app.

For the NextJS app to work properly from the `_build` directory, files and folders required by the app have to be copied into the output directory using the `runtime_deps` stanza in a `dune` file:

```ocaml
(melange.emit
 (target nextjs-app-folder-reason)
 (alias nextjs)
 (module_systems es6)
 (libraries app api components bindings)
 (runtime_deps
  jsconfig.json
  next-env.d.ts
  next.config.js
  package.json
  postcss.config.js
  tailwind.config.js
  tsconfig.json
  (source_tree public)))
```

This effectively replicates the standard app directory structure in the `_build` folder, and on compilation the Reason files will be compiled to JS files:

![build folder structure](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/w6koi710tq2jy3ai7ypy.png)

To run the app from the root directory the commands in `package.json` have to be updated, e.g., `"cd _build/default/nextjs && next dev"`.

### `dune` files

In the image above you can see that there are a lot of `dune` files. The `dune` files contain stanzas that, among other things, can define libraries, specify what libraries this library relies on, and how the library should be processed. For example, the `dune` file in the `api` folder is:

```ocaml
(library
 (name api)
 (libraries melange-json melange-fetch bindings joke)
 (modes melange)
 (preprocess
  (pps melange.ppx)))
```

Every subfolder of `api/` is a route, e.g., `api/joke/`, and requires its own `dune` file, which is then referenced in the `api/dune` file.
Writing a `dune` file for each route (and page) is not hard, but it could get tedious really quickly if there are a lot of them.

![dune files everywhere](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/7bi9gl402i87xlean1lu.jpeg)

One way to get around this is to modify the `api/dune` file with `(include_subdirs qualified)`; this means that every subdirectory of `api/` can be referenced by module namespacing and we don't have to write `dune` files for every route (or pages) folder. However, the [OCaml LSP does not like it](https://github.com/ocaml/dune/issues/8297) and red squiggles will show up in the editor (although the app with still compile without errors). Trying to develop the app knowing those red squiggles cannot be vanquished would drive me nuts, so instead of using `(include_subdirs qualified)` I just wrote `dune` files for every route (and page) which gets rid of the red squiggles.

Dune and the NextJS dev server are completely fine with this application and directory structure, and everything works during development; but when trying to build the app NextJS turns cantankerous.

![shocked gopher](https://media.giphy.com/media/XhcSIUIkgbmuY/giphy.gif)

## [Computer Says No](https://www.youtube.com/watch?v=x0YGZPycMEU)

### `make`

When creating a React component with Reason it is typical to use the word `make` as the name of the function that will create the component. So the dogs page, for example, might look something like:

```reasonml
// src/app/dogs/page.re

[@react.component]
let make = () => {
  <Dog />; // Dog component from src/app/components/Dog.re
};

```

In the output JS file created by Melange the export will be:

```js
// ...
var make = Dog;

export { make };
```

But `next build` will give a type error:

```shell
Type error: Page "src/app/dogs/page.js" does not match the required types of a Next.js Page.
"make" is not a valid Page export field.
```

Okay. Let's try changing `make` to `default`. Now the output JS has a default export:

```js
// ...
var $$default = Page$default;

export { $$default, $$default as default };
```

But still `next build` will give a type error:

```shell
Type error: Page "src/app/dogs/page.js" does not match the required types of a Next.js Page.
"$$default" is not a valid Page export field.
```

Deleting the extra `$$default` from the export in the output JS file, so that the the export is just `export { $$default as default };`, seems to fix the problem, but editing the output JS is a bad idea and not practical. I'm not sure why Melange adds the extra `$$default` to the export but NextJS does not like it.

### Routes

According to the NextJS docs routes have to export a function with the name of the HTTP method you want to use, e.g., `export async function POST(request) {...};`. In Reason/OCaml we cannot use `POST` as the name of a function because a word beginning with an uppercase letter is a [constructor for a data type](https://ocaml.org/docs/data-types#a-simple-custom-type). To get around this we can we use `bs.raw` to write some raw JavaScript in the Reason code:

```reasonml
// src/app/api/joke/route.re
let handler = request => {
/// ...
};

[%%bs.raw {|export const POST = handler|}];
```

And the output JS will be:

```js
...
export const POST = handler
;

export {
  decodeJokeCount , // JSON decoder function
  decodeJoke ,      // JSON decoder function
  handler ,
}
```

Will `next build` let us pass??? No.

```shell
Type error: Route "src/app/api/joke/route.js" does not match the required types of a Next.js Route.
"decodeJokeCount" is not a valid Route export field.

Type error: Route "src/app/api/joke/route.js" does not match the required types of a Next.js Route.
"decodeJoke" is not a valid Route export field.

Type error: Route "src/app/api/joke/route.js" does not match the required types of a Next.js Route.
"handler" is not a valid Route export field.
```

Once again NextJS does not like the extra export fields. Using an interface file can restrict the exports and make `decodeJokeCount` and `decodeJoke` private; however, trying to make `handler` private so that the only export is `export const POST = handler;` is not possible, and trying to do so causes Melange to output an empty JS file.

## Refactoring

To stop `next build` from slapping us with type errors we have to wrap the Reason code with JavaScript, which means creating `page.js` and `route.js` files and importing the Reason code (the output JS code) into them. This is now a situation that is similar to the Astro project, and so now, rather than having many folders and many `dune` files, all of the Reason code can be put into one folder. Because of this it also makes sense to promote the output JavaScript out of the `_build` folder and back into the `src` folder, which means that project files no longer have to be copied to the `_build` folder.

![Refactored folder structure](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/yoqls5wu1q7xhmqx0x6t.png)

### Directives and bindings

`"use client"` directive binding:

```reasonml
[@bs.config {flags: [|"--preamble", "\"use client\";"|]}];
```

Font and metadata bindings for the root layout:

```reasonml
[%%bs.raw "import './globals.css'"];
[%%bs.raw "import { Inter } from 'next/font/google'"];
[%%bs.raw "const inter = Inter({ subsets: ['latin'] })"];

type font;
type metadata = {
  title: string,
  description: string,
};

[@bs.val] external inter: font = "inter";

[@bs.get] external fontClassName: font => string = "className";
```

Since the Reason code is now wrapped in JS less bindings are required because they can just be written in the JavaScript file; therefore, bindings like those above are no longer needed.

The refactored code is the code in the main branch. The all Reason code version of the app can be found on the `include-subdirs-qualified` branch.

## Conclusion

Replacing all of the JavaScript in a NextJS App Router application with Reason is currently not possible. Reason can be used for the majority of the code but it will need to be wrapped in JS for it to be compatible with NextJS. I'm not sure why NextJS is so strict on what fields are exported. As long the fields NextJS needs are exported I don't see why other export fields are a problem, especially since they cause no problem during development. I also wish these problems would have showed up sooner during development instead of during building. There may be some Dune or NextJS configuration options that I have missed, but at this point I'm too tired and [bored](https://www.youtube.com/watch?v=0VH-tJSpkjA) to try and figure it out.
