In [my previous post](https://dev.to/psb/nextjs-the-app-router-and-reasonreact-2c0j) on trying to use the NextJS App Router and Reason I described some of the problems and limitations of their compatibility with one another. With the [release of Melange 2](https://github.com/melange-re/melange/releases/tag/2.0.0) I decided to see if the new features of Melange 2 could help to increase the compatibility of Reason and the NextJS App Router. I have also documented some of the things learnt after trying Melange (v1) with Astro and Remix.

## Melange 2

Melange 2 introduces a couple of new features that help to make Reason and ReasonReact more compatible with the NextJS App Router.

### `@mel.as`

The `@mel.as` attribute allows us to redefine a name in the output JavaScript. Using `@mel.as` we can solve one of the previous problems with NextJS API route functions and Reason. NextJS expects API route functions to export a function with the name of a HTTP method. With `@mel.as` we can rename our Reason API function to the HTTP method we want in the output JS and get no export related errors from NextJS:

```reasonml
[@mel.as "POST"]
let handler = () => {
    ...
};
```

Will be compiled to:

```js
function POST(param) {
    ...
}

export {
  POST ,
}
```

Astro API endpoints also require the route function to be named after a HTTP method, so this will be useful for Astro as well.

### `$$default`

Another previous compatibility problem was the export of `$$default` whenever `default` was used as the function name in ReasonReact instead of `make`. The export of `$$default` would cause NextJS to complain and not compile. In Melange 2 `$$default` is still present but it is exported properly in the output JS:

```reasonml
[@react.component]
let default = () => {
    ...
};
```

Compiles to:

```js
function Page$default(Props) {
    ...
}

var $$default = Page$default;

export {
  $$default as default,
}
```

`@mel.as` and the changes to `$$default` make Reason and ReasonReact much more compatible with the NextJS App Router.

## Structuring a Reason and React meta-framework app

After experimenting with Reason plus Astro, NextJS, and Remix, I think there are two main ways to structure a React meta-framework app for use with Reason, and it depends upon how much Reason you want to use and how you are deploying your app. If you want to write a few components in ReasonReact then it is best to promote (i.e., copy) the output JS back into the `src` folder of your app. If you want to write most of your app in Reason then it is best to add the meta-framework files as Melange dependencies and then promote all the output JS out of the `_build` folder and back into the root.

### Why promote

Developing in the OCaml way can be done by copying all of the meta-framework files to the `_build` folder as Melange dependencies and then serving the app from the JavaScript output folder in `_build`. However, I have found that this doesn't always go smoothly and can cause the meta-framework development tooling to behave in unexpected ways. You could try and debug these unexpected behaviours, but ...

![no time for that](https://media.giphy.com/media/bWM2eWYfN3r20/giphy.gif)

I have found that the meta-framework dev tooling works much better if you promote the output JS into a folder that the meta-framework dev tooling expects to be used.

Promoting the output code also makes it much easier to deploy an application via linking a Git repository to a platform like Vercel or Netlify and deploying on push.

### Promoting components

If your are only using ReasonReact to create a few components then it is best to promote the output JS of those components back into the `src` folder. For example, if you have an Astro app like:

```shell
/
├── _build/
├── public/
├── src/
│   ├── dune
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── dogs.astro
│   │   ├── jokes.astro
│   │   └── index.astro
│   └── reason_components/
│       ├── Dog.re
│       ├── Dog.rei
│       ├── Joke.re
│       ├── Joke.rei
│       └── dune
├── package.json
├── astro-reason.cfg.mjs
├── <project_name>.opam
├── dune
├── dune-project
└── Makefile
```

After promoting the output of the `reason_components` folder you will end up with:

<pre>
<code>
/
├── _build/
├── public/
├── src/
│   ├── dune
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── dogs.astro
│   │   ├── jokes.astro
│   │   └── index.astro
│   ├── reason_components/
│   │   ├── Dog.re
│   │   ├── Dog.rei
│   │   ├── Joke.re
│   │   ├── Joke.rei
│   │   └── dune<span style="color: #dd4b39">
│   └── reason_components_output/
│       ├── node_modules/
│       └── src/
│           └── reason_components/
│               ├── Dog.js
│               └── Joke.js</span>
├── package.json
├── astro-reason.cfg.mjs
├── <project_name>.opam
├── dune
├── dune-project
└── Makefile
</code>
</pre>

No doubt, the path to the components in the promoted output folder is ugly and cumbersome, but you can remedy this by adding a path alias in a `tsconfig.json` or `jsconfig.json` file:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/reason_components_output/src/reason_components/*"]
    }
  }
}
```

### Promoting serverless functions

How you promote serverless functions depends on where you are deploying them. If you are using something like Netlify, where functions can be configured independently of the frontend, then promoting the serverless functions folder might be the best option.

Expanding on the Astro example above we can add serverless functions:

<pre>
<code>
/
├── _build/
├── public/
├── reason_netlify_functions/
│   ├── dune
│   └── joke.re<span style="color: #dd4b39">
├── reason_netlify_functions_output/
│   ├── node_modules/
│   └── reason_netlify_functions/
│       └── joke.js</span>
├── src/
...
└── Makefile
</code>
</pre>

We can then tell Netlify the location of our functions (`./reason_netlify_functions_output/reason_netlify_functions`) in a `netlify.toml` file. [See this basic Astro, Reason and Netlify application for an example](https://github.com/psb/astro-reason).

If you are using something like Vercel, where the serverless functions are expected to be in a certain folder, then it might be best to promote the whole app.

### Promoting the whole app

When promoting only certain folders extra paths are created when the output JS files are copied back next to the Reason source files. If we were to do this for applications that require serverless function routes to be in an `api` folder then the path for that route would be long and ugly; for example, you could end up with something like `api/output/reason_serverless_functions/joke/route.js`. You could use some hacks to get around such a path, e.g., redirects or a `.env` value to shorten the path, but...

![no time for that](https://media.giphy.com/media/bWM2eWYfN3r20/giphy.gif)

A better and cleaner solution is to promote the whole app. What does it mean to promote the whole app? Promoting the whole app involves adding all the meta-framework files to a `melange.runtime_deps` stanza as dependencies so that they are copied to the `_build` folder and next to the output JS files. We can then promote all the meta-framework files back out of the `_build` folder along with the output JS.

A typical TypeScript NextJS App Router application will be structured something like:

```shell
├── README.md
├── app/
│   ├── api/
│   │   └── joke/
│   │       └── route.ts
│   ├── jokes/
│   │   └── page.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── next-env.d.ts
├── next.config.js
├── node_modules/
├── package-lock.json
├── package.json
├── postcss.config.js
├── public/
├── tailwind.config.ts
└── tsconfig.json
```

We can then convert it to a Reason application:

<pre>
<code>
├── README.md
├── <span style="color: #dd4b39">reason_app/</span>
│   ├── api/
│   │   └── joke/
│   │       ├── <span style="color: #dd4b39">dune</span>
│   │       └── <span style="color: #dd4b39">route.re</span>
│   ├── jokes/
│   │   ├── <span style="color: #dd4b39">dune</span>
│   │   ├── <span style="color: #dd4b39">page.re</span>
│   │   └── <span style="color: #dd4b39">page.rei</span>
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── <span style="color: #dd4b39">dune</span>
├── next-env.d.ts
├── next.config.js
├── node_modules/
├── package-lock.json
├── package.json
├── postcss.config.js
├── public/
├── tailwind.config.ts
├── tsconfig.json<span style="color: #dd4b39">
├── &lt;project_name&gt;.opam
├── dune
├── dune-project
└── Makefile</span>
</code>
</pre>

**It is important to note that we are not using a `src` folder (i.e., ./src/app/) for our application structure and Reason source code.** We will be using the `src` folder eventually because it is important when promoting the output JS.

We have to rename the `app` folder to `reason_app` because an `app` folder at the root level will take priority over a `src/app` folder.

In `./app/dune` we add the NextJS files to the `melange.runtime_deps` stanza:

<pre>
<code>
(library
 (name app)
 (modes melange)
 (libraries reason-react jokes)<span style="color: #dd4b39">
 (melange.runtime_deps
  favicon.ico
  globals.css
  (glob_files *.tsx))</span>
 (preprocess
  (pps reason-react-ppx melange.ppx)))
</code>
</pre>

We can then add a `reason_bindings` folder at the root level for any bindings we want, and when we build the app the output in the `_build` folder will be:

```shell
./_build/default/output/
├── reason_app/
│   ├── api/
│   │   └── joke/
│   │       └── route.js
│   ├── jokes/
│   │   └── page.js
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── reason_bindings/
└── node_modules/
```

Note the `node_modules` folder. This `node_modules` folder contains the output JS for the Melange libraries used in the application. It is not the contents of the `node_modules` folder created from `package.json`.

Using dune `directory-targets` (add `(using directory-targets 0.1)` to the `./dune-project` file) we can promote the output JS in the `_build` folder how we like. In `./dune` we can add a rule for the promotion of the output code to the all important `./src` folder, thus creating a typical NextJS application structure that uses `./src/app`:

```
(rule
 (alias promote-app)
 (mode
  (promote (until-clean)))
 (deps
  (alias_rec nextjs))
 (targets
  (dir src))
 (action
  (bash
   "mkdir src && cp -r output/reason_app src/app && cp -r output/reason_bindings src && cp -r output/node_modules src")))
```

`alias promote_app` is an alias we can use in our Makefile so that the rule is run after every build. `deps (alias_rec nextjs)` is a dependency on the recursive construction of our main application code which has the alias of `nextjs`. `dir src` sets the target for the promotion of the output JS as `src`. In the action stanza we use bash to copy `output/reason_app` to `src/app`, making it recognisable to NextJS. We also copy `reason_bindings` and the Melange `node_modules` to `src` so that they are at the same directory level as `app`, which is important for maintaining import paths defined in the application when it was built and put into the `build` folder. What we end up with is:

```
/
├── _build/
...
├── public/
├── reason_app/
├── reason_bindings/
├── src/
│   ├── app/
│   ├── node_modules/
│   └── reason_bindings/
├── package.json
├── next.config.js
...
├── <project_name>.opam
├── dune
├── dune-project
└── Makefile
```

And the app should work perfectly with the NextJS dev tooling. [See this basic NextJS App Router, Reason and Melange 2 application for an example](https://github.com/psb/nextjs-approuter-melange2).

## Miscellaneous

### Melange `node_modules` and deployment

If you want to deploy your app by connecting a Git repo to a service like Vercel or Netlify then you need to include the Melange `node_modules` folder in the repository. If you don't you will likely get errors about being unable to find certain Melange libraries during the build process.

If you don't want to commit the Melange `node_modules` folder to your repo then you can build the app locally using the Vercel/Netlify CLI and deploy using the CLI as well.

Another option is to use a CI/CD workflow to spin up a Linux container, install opam and build everything from scratch, but...

![no time for that](https://media.giphy.com/media/bWM2eWYfN3r20/giphy.gif)

### Directives

To use the directives `"use client"` and `"use server"` in a NextJS App Router application add `[@mel.config {flags: [|"--preamble", "\"use client\";"|]}];` to the top of a file.

### React Server Components

React Server Components are not yet supported by ReasonReact. You can work around this by creating a standard `page.tsx` file. If you need a React component then you can write one in ReasonReact and import it into the page file.

### Editor errors when importing components from ReasonReact

If you structure your application so that the whole app is going to be promoted out of the `_build` folder and you import a ReasonReact component from a `.re` file into a `page.tsx` file you will get an editor error about the import. This error occurs because you have to import the component as if the `.re` file was a JS component file. Once compiled the `.re` file will be converted to a `.js` file in the `_build` folder and it will be in the correct location for the import to work properly after promotion. This is another reason to ensure that the folder structure of the output JS in the `_build` folder is maintained when promoting the code.

### Special characters in file names

Dune will allow some special characters in folder names but it does not allow them in file names ([in my limited experience](https://github.com/ocaml/ocaml.org/issues/1635)). Remix uses file name based routing and the file names can have special characters in them, e.g., `concerts.$city.js`. When a file name with special characters in it fails to compile we can use a Dune rule stanza to create an output JS file with special characters in it:

<pre>
<code>
; ./src/routes/dune

(library
 (name app)
 (libraries reason-react routes bindings)
 (modes melange)
 (melange.runtime_deps tailwind.css <span style="color: #dd4b39">concerts_city.js</span>)
 (preprocess
  (pps reactjs-jsx-ppx melange.ppx)))

(rule
 (target <span style="color: #48a9dc">concerts.$city.js</span>)
 (deps %{project_root}/remix/app/routes/<span style="color: #dd4b39">concerts_city.js</span>)
 (action
  (copy %{deps} %{target})))
</code>
</pre>

In the above dune file we add `concerts_city.js` to the `melange.runtime_deps` - this is the output JS file name created from the Reason source code file `concerts_city.re`. In the rule stanza we set the target as the special character containing file name we want and the dependency (`deps`) as the path to `concerts_city.js` in the `_build` folder. The rule then copies `concerts_city.js` to `concerts.$city.js`, which should then work perfectly in a Remix application. [Here is a broken and unfinished Remix app](https://github.com/psb/remix-reason) that may be of some limited use.

### Hot Module Replacement (HMR)

If you find that HMR is not working properly it might help to add a delay to the meta-framework file watcher. For NextJS you could add the following to `next.config.js`:

```js
...
const nextConfig = {
  ...
  webpack: function (config, context) {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  ...
};
...
```

### Ignore `_build` and `_opam` folders

A meta-frameworks file watcher will watch for any changes in any of the files and folders in root. The presence the OCaml `_build` and `_opam` folders can cause the meta-frameworks file watcher to behave in unexpected ways, so it is best to configure the meta-frameworks file watcher to ignore the `_build` and `_opam` folders. For Astro you can add the following to `astro.config.mjs`:

```js
...
export default defineConfig({
  ...
  vite: {
    server: {
      watch: {
        ignored: ["**/_build/**", "**/_opam/**"]
      }
    }
  },
  ...
});
```

## Conclusion

Melange 2 and the capabilities of Dune allow Reason and ReasonReact to work very well with React meta-frameworks. There maybe a few aspects of the meta-framework and their development tools that you have to work around, but hopefully the information above should help to make development go smoothly.

---

Thank you to [Javier Chávarri](https://twitter.com/javierwchavarri) for the help with Dune.
