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

1. On load, `src/App.js` fetches the recipe list and a random bread photo from Unsplash.
2. Choosing a bread sets `recipe` in App state.
3. Changing the flour input scales every baker’s percentage against that flour weight.
4. `BreadIngredients`, `Bread`, and `BreadPreperation` render scaled amounts and the schedule.

Ingredient math is `percentage / 100 * flour`, rounded to a whole gram.

## Possible upgrades

1. **Bake journal (bread projects)** — Save a named bake with notes and the actual amounts of flour, salt, leaven/yeast, and water you used. See [FEATURE_UPGRADE.md](FEATURE_UPGRADE.md).
2. **Load recipes from the local JSON file** — The app currently requests `breadRecipes.json` from GitHub Pages. Serving the copied file from webpack (already copied into `dist/`) would work offline and make local recipe edits show up immediately.
3. **Units and hydration** — Toggle grams vs ounces, and show dough hydration and total dough weight alongside the ingredient list. Milk bread extras (tangzhong, milk, butter, sugar, eggs) are in the JSON but not rendered yet.
4. **Prep timers** — Turn the autolyse / bulk / proof / bake table into startable timers with alerts so you can follow a bake without watching the clock.

More context for contributors and agents is in [AGENTS.md](AGENTS.md).
