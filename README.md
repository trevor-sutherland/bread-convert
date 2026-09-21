# Bread Convert

A baker’s-percentage calculator for scaling bread recipes. Pick a loaf, set a flour weight, and the app converts each ingredient (white flour, whole wheat, water, salt, yeast or leaven) into grams. It also shows preparation times and temperatures for autolyse, bulk fermentation, proof, and bake.

Recipes live in `public/breadRecipes.json` (Ken Forkish wheat bread, Tartine country loaf, focaccia, Joshua Weissman milk bread). The UI is a small React 17 app bundled with webpack.

## Run locally

```bash
npm install
npm start
```

Then open [http://localhost:8080](http://localhost:8080). Webpack Dev Server reloads on save.

To write a production bundle to `dist/`:

```bash
npm run pack
```

Node 16+ is a safe local target (CI still lists 12/14/16).

## How it works

1. On load, `src/App.js` fetches the recipe list and a random bread photo from Unsplash, and loads any saved projects from localStorage.
2. Choosing a bread sets `recipe` in App state and seeds editable actual gram amounts.
3. Changing the flour input scales every baker’s percentage against that flour weight.
4. `BreadIngredients` and `BreadPreperation` render scaled amounts and the schedule; the project editor saves actuals + notes.

Ingredient math is `percentage / 100 * flour`, rounded to a whole gram (`src/scaleIngredients.js`).

## Bake journal

Save a named **bread project** with notes, an optional photo, and the actual grams you mixed (flour, water, salt, leaven/yeast, and milk-bread extras when present). Projects live in **localStorage** on this device; use Export / Import JSON to back them up. Details: [FEATURE_UPGRADE.md](FEATURE_UPGRADE.md).

## Possible upgrades

1. **Units** — Toggle grams vs ounces, and show total dough weight alongside hydration (hydration is already shown on the project form).
2. **Prep timers** — Turn the autolyse / bulk / proof / bake table into startable timers with alerts so you can follow a bake without watching the clock.
3. **Project photos / ratings** — Optional later additions called out in the feature upgrade doc.

More context for contributors and agents is in [AGENTS.md](AGENTS.md).
