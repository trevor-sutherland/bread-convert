# Feature upgrade: bread projects, notes, and bake amounts

## Why

Today Bread Convert is a calculator. You pick a recipe, type a flour weight, and see scaled grams. Nothing is saved. After a bake you cannot look back at what you actually used, how the loaf felt, or whether you changed salt or leaven from the formula.

A **bread project** (one bake, or a loaf you are iterating on) would turn the converter into a small journal: formula in, real numbers and notes out.

## The idea

Add a way to create a named project, attach notes, and store the amounts you mixed — flour, salt, leaven or yeast, water, and any extras.

Typical flow:

1. Choose a base recipe (Country Loaf, Focaccia, etc.) or start from a blank formula.
2. Set target flour weight as you do now; the app still scales percentages to grams.
3. Save as a **project** with a title (for example “Saturday country loaf” or “Focaccia — neighbor dinner”).
4. Optionally **edit the actual amounts** if you scooped a bit more salt, used a stiffer leaven, or held back water.
5. Write **notes**: dough feel, fermentation time vs plan, oven spring, crumb, what to change next time.
6. Reopen the project later to repeat the bake or compare against the original baker’s percentages.

## What to save

Each project should persist at least:

| Field | Purpose |
| --- | --- |
| `id`, `title`, `createdAt` / `updatedAt` | Identity and history |
| `sourceRecipeTitle` | Which catalog recipe it started from |
| `notes` | Free text (process, taste, next time) |
| `flour` | Total flour in grams (the scaler) |
| `whiteFlour`, `wholeWheatFlour` | Split if the formula uses both |
| `water` | Grams (hydration can be derived) |
| `salt` | Grams |
| `leaven` **or** `yeast` | Grams, matching recipe type |
| extras when present | e.g. milk, butter, sugar for milk bread |

Derived display is useful but does not need to be stored: hydration (`water / flour * 100`), salt %, leaven %, and a side-by-side “formula vs actual” if the baker overrode grams.

Example payload:

```json
{
  "id": "proj-2026-09-19-1",
  "title": "Saturday country loaf",
  "sourceRecipeTitle": "Country Loaf (Sourdough)",
  "createdAt": "2026-09-19T18:00:00Z",
  "flour": 1000,
  "whiteFlour": 900,
  "wholeWheatFlour": 100,
  "water": 800,
  "leaven": 200,
  "salt": 20,
  "notes": "Held 20g water back on mix; dough felt slack by hour 3. Bake 475F, lid off last 15. Open crumb, a bit pale — next time 5 more minutes."
}
```

## UI sketch

- **New project** from the current selection + flour field (pre-fill scaled grams).
- **Notes** textarea on the project, saved with the numbers, not a separate app.
- **Actuals** as editable gram fields next to the calculated list so you can log what went in the bowl.
- **Project list** (sidebar or a simple page): title, date, recipe name; click to restore amounts and notes.
- Optional later: rating, or a checkbox for “would bake again.”

## Persistence (keep it small)

**Implemented:** projects persist in the browser via **localStorage** (`breadConvert.projects`), including an optional **photo** (JPEG data URL, resized client-side before save). Export/import JSON backs up and restores the journal without a backend.

Projects are *bakes*, not catalog formulas — keep those two lists separate from `breadRecipes.json`.

## How this fits the current code

- Reuse existing scaling in `BreadIngredients` / `Bread` / `Yeast` / `Leaven` to seed actuals.
- Lift “saved projects” into `App` state (or a small module) so the flour input and recipe select can hydrate from a project.
- Do not require login. One browser, one baker, is enough for the first version.

## Out of scope for v1

- Multi-user sync or a real API
- Inventory of flour bags
- Automatic conversion from volume (cups)
- Editing the shared GitHub Pages recipe catalog from the journal
- Star ratings or “would bake again” (optional later)

## Status

Shipped in the app UI: **Bread projects** list, **Save / Update / Delete**, editable **actual amounts**, **notes**, optional **photo**, hydration hint, and **Export / Import** JSON. Data stays on the device (localStorage).

## Success

You can leave the kitchen, come back a week later, open “Saturday country loaf,” read your notes, and see exactly how much flour, salt, and leaven you used — not only the percentages on the original formula.
