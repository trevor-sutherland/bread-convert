/** Round baker's percentage to whole grams for a flour weight. */
export function scalePercent(percent, flour) {
  const flourNum = Number(flour) || 0;
  const pct = Number(percent);
  if (Number.isNaN(pct)) return 0;
  return Math.round((pct / 100) * flourNum);
}

/**
 * Build actual gram amounts from a catalog recipe + flour weight.
 * Includes milk-bread extras when present on the formula.
 */
export function scaleRecipeToActuals(recipe, flour) {
  if (!recipe || !recipe.ingredients) {
    return {
      flour: Number(flour) || 0,
      whiteFlour: 0,
      wholeWheatFlour: 0,
      water: 0,
      salt: 0,
    };
  }

  const ing = recipe.ingredients;
  const flourNum = Number(flour) || 0;
  const actuals = {
    flour: flourNum,
    whiteFlour: scalePercent(ing.whiteFlour, flourNum),
    wholeWheatFlour: scalePercent(ing.wholeWheatFlour, flourNum),
    water: scalePercent(ing.water, flourNum),
    salt: scalePercent(ing.salt, flourNum),
  };

  if (ing.leaven !== undefined && !Number.isNaN(Number(ing.leaven))) {
    actuals.leaven = scalePercent(ing.leaven, flourNum);
  }
  if (ing.yeast !== undefined && !Number.isNaN(Number(ing.yeast))) {
    actuals.yeast = scalePercent(ing.yeast, flourNum);
  }

  ['milk', 'eggs', 'butter', 'sugar'].forEach((key) => {
    if (ing[key] !== undefined && !Number.isNaN(Number(ing[key]))) {
      actuals[key] = scalePercent(ing[key], flourNum);
    }
  });

  return actuals;
}

export function hydrationPercent(water, flour) {
  const f = Number(flour);
  const w = Number(water);
  if (!f || Number.isNaN(f) || Number.isNaN(w)) return null;
  return Math.round((w / f) * 1000) / 10;
}
