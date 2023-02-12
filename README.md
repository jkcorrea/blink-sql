# Blink SQL

Blink is a modern & open-source SQL database client with a focus on rich data & collaboration.

> NOTE: Blink is under heavy development. Most of the codebase is experimental and subject to change.

## Prerequisites
- Node 16+
- [PNPM](https://pnpm.io/installation) for package management
- [Rust](https://www.rust-lang.org/tools/install) - required to run Tauri
- *[Go](https://go.dev/doc/install) - *this is is temporary, as we're currently building `usql` from source & dropping the binary in as a Tauri Sidecar. Eventually we should handle SQL queries via Rust or JS.

## Quick start

1. Install NPM dependencies
```sh
pnpm install
```

2. Install other system dependencies via the `setup-system.sh` script:
```sh
./scripts/setup-system.sh
```
> NOTE: This will download & build [uSQL](https://github.com/xo/usql), which we currently use to make SQL queries to an array of database types. You should get with a binary in the `src-tauri/binaries/usql` directory. We do not track this binary in Git.

3. Run the project with Tauri!
```sh
pnpm tauri dev
```


## Project Overview

You really should reference [Tauri](https://tauri.app/v1/guides/) for an overview of how Tauri works. Similar to Electron, Tuari runs an isolated web browser that has the special ability to talk to a Rust backend. The biggest difference from Electron is that the browser isn't necessarily, Chrome but instead whatever the native browser on the platform is. This results in smaller binary sizes & less memory usage.


### Frontend (`src/`)

On the frontend, the main pieces of the stack are:
* [Preact](http://preactjs.com)
* [React Router](http://reactrouter.com)
* [TailwindCSS](http://tailwindcss.com)
  * w/ [DaisyUI](http://daisyui.com)
* [TanStack Query](https://tanstack.com/query)
 * w/ [QueryKeyFactory](https://github.com/lukemorales/query-key-factory)
* [TanStack Table](https://tanstack.com/table/v8)

* `components` - Where we keep any UI components that might be shared between pages (Buttons, Input elements, etc)
* `constants` - App constants
* `pages` - A "page" represents a specific route the user may navigate to. A page can be a single file (e.g. `pages/404.tsx`, `pages/project/index.tsx`) or a whole folder.
  * A neat pattern you may want to use is to **co-locate** components that are only used in a single page with that page. For example, we can create a folder - `pages/project/table/` - and inside we can keep related components that aren't their own page but also aren't used anywhere else in the app.
* `services` - Business logic, grouped by feature
* `types` - TypeScript types we may use in various places of the app. Prefer not to add things here & instead export types close to the implementations
* `utils` - Misc utilities used throughout the app
* `index.tsx` - The entrypoint for the app
* `router.tsx` - [React Router](http://reactrouter.com) route definitions

### Backend (`src-tauri/`)

TBD. So far we're not using much of the Tauri backend, so you can more or less ignore it for now.

### Config files

Here's what each of the config files you may find are for:

* `package.json` - Specifies frontend dependencies. The `scripts` field specifies commands to run e.g. `pnpm dev` runs whatever `scripts.dev` has.
* `.babelrc` / `vite.config.ts` - We use [Vite](https://vitejs.dev) to build the frontend. Vite does a lot, including wrapping `babel` which parses JSX for us.
* `tailwind.config.cjs` / `postcss.config.cjs` - We use [TailwindCSS](http://tailwindcss.com) for styling the UI. Tailwind runs alongside the dev server, autocompiling stylesheets upon changes. It uses PostCSS under the hood.
* `tsconfig.json` - Having this makes the project a TypeScript project. Because we're using Vite to build the project, we actually only need typescript for type checking during development & we don't use the TS compiler `tsc` to actually build the project.
* `.eslintrc.cjs` / `.prettierrc` - Lint & code formatting rules

### Recommended IDE Setup

I strongly recommend using to develop with. There are many plugins that integrate deeply with this project. Things like IntelliSense, linting, debugging, code suggestions, highlighting, etc are available using VSCode. I can't say as much for any other editors.

There's an entry in `.vscode/extensions.json` for recommended extensions. If you open up the extension panel in VSCode you'll see them pop-up. Install all of those.
