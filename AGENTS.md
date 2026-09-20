# AGENTS.md

Guidance for people and coding agents working in this repository.

## What this repo is

**Bread Convert** is a single-page React app that scales bread recipes by baker’s percentage. The user selects a recipe and a flour weight; the UI shows gram amounts and a preparation schedule.

There is no backend, database, or auth. All data is static JSON plus two HTTP calls from the browser (recipes + Unsplash).

## Layout

```
src/
  index.js                 React mount
  App.js                   State, recipe fetch, Unsplash, flour input
  App.css / index.css
  Control/
    BreadSelect.js         Dropdown options from recipe list
    Flour.js               Flour weight number input
    BreadIngredients.js    Scaled ingredient list
    Bread.js               Second copy of the scaled list (title + amounts)
    BreadPreperation.js    Autolyse / bulk / proof / bake table
    Yeast.js / Leaven.js   Yeast vs leaven row
public/
  breadRecipes.json        Recipe catalog (percentages + prep)
  index.html               HtmlWebpackPlugin template (Bootstrap 5 CDN)
webpack.config.js          Entry, Babel, CSS, copy recipes into dist/
.github/workflows/webpack.yml   npm install + webpack on master
```

`package.json` scripts:

| Script | Command | Purpose |
| --- | --- | --- |
| `npm start` | `webpack serve` | Dev server (default **http://localhost:8080**) |
| `npm run pack` | `webpack` | Production-ish bundle to `dist/bundle.js` |

There is no `npm test` or `npm run build`. The README that used to describe Create React App is outdated; this project is webpack + Babel, not CRA.

## Run locally

Requirements: Node (16+ recommended), npm.

```bash
npm install
npm start
```

Open http://localhost:8080. Webpack Dev Server serves the HtmlWebpackPlugin page and copies `public/breadRecipes.json` into the output folder.

To inspect the built files without the dev server:

```bash
npm run pack
```

Output is `dist/` (`bundle.js`, `index.html`, `breadRecipes.json`).

### Runtime data sources

Recipes are **not** loaded from the local public file at runtime. `App.js` `componentDidMount` does:

```text
GET https://trevor-sutherland.github.io/bread-convert/public/breadRecipes.json
```

Local edits to `public/breadRecipes.json` will not appear until that GitHub Pages file is updated, unless you change the fetch URL (for example to `/breadRecipes.json` after CopyWebpackPlugin).

The header image is a random Unsplash photo (`query=bread`) with a client id hardcoded in `App.js`. Rate limits or a revoked key will leave the image empty; the rest of the app still works.

## Recipe shape

Each item in `breadRecipes.json` looks like:

- `author`, `title`, `type` (`Yeasted` or `Sourdough`)
- `ingredients`: baker’s percentages. Typical keys: `whiteFlour`, `wholeWheatFlour`, `water`, `salt`, plus either `yeast` or `leaven`. Milk bread also has nested `tangzhong` and extra keys (`milk`, `eggs`, `butter`, `sugar`) that the UI does not display.
- `preperation` (spelling is **preperation** throughout the JSON and components — keep it unless you migrate both): `autolyse`, `bulkFermentation`, `proof`, `bake` (`time`, `temperature`), and `total` hours.

Scaling: `Math.round((percent / 100) * flour)`. Flour state is initialized as `[500]` (an array) and the input uses `name="flour"`.

## Conventions

- Class components (`React.Component`), not hooks.
- Bootstrap 5 classes from the CDN in `public/index.html`.
- Keep baker’s math in the Control components unless you extract a shared helper (today `Bread` and `BreadIngredients` duplicate the same list).
- Prefer small, focused changes. Do not add a framework or TypeScript unless asked.
- Do not commit secrets. Move the Unsplash key to an env var if you touch that call.
- CI: `.github/workflows/webpack.yml` runs on `master` push/PR with Node 12, 14, and 16.

## Feature work

A planned bake journal (named bread projects, notes, saved flour/salt/leaven amounts) is described in [FEATURE_UPGRADE.md](FEATURE_UPGRADE.md). Implement that only when requested; do not add persistence by default.

## Pitfalls

- Duplicate ingredient UIs: `Bread` and `BreadIngredients` are nearly identical; changing one without the other will look inconsistent.
- `Flour` is passed `this.props.bread` from `App` (undefined). The controlled `value={this.props.flour}` on the input is therefore unused; flour still updates via `changeFlour`.
- Invalid JSX: several components pass multiple `className` attributes on one element (only the last applies).
- `this.props.recipe.ingredients.yeast === NaN` never works (`NaN === NaN` is false); use `Number.isNaN`.
- Webpack 5 + `webpack-dev-server` 3 can be picky on newer Node; if `npm start` fails, try Node 16 or 18.
