import React, { Component } from 'react';
import { hydrationPercent } from '../scaleIngredients';

const AMOUNT_FIELDS = [
  { key: 'flour', label: 'Total flour (g)' },
  { key: 'whiteFlour', label: 'White flour (g)' },
  { key: 'wholeWheatFlour', label: 'Whole wheat flour (g)' },
  { key: 'water', label: 'Water (g)' },
  { key: 'salt', label: 'Salt (g)' },
  { key: 'leaven', label: 'Leaven (g)' },
  { key: 'yeast', label: 'Yeast (g)' },
  { key: 'milk', label: 'Milk (g)' },
  { key: 'eggs', label: 'Eggs (g)' },
  { key: 'butter', label: 'Butter (g)' },
  { key: 'sugar', label: 'Sugar (g)' },
];

class ProjectEditor extends Component {
  render() {
    const {
      projectTitle,
      notes,
      actuals,
      formulaActuals,
      sourceRecipeTitle,
      activeProjectId,
      onTitleChange,
      onNotesChange,
      onActualChange,
      onSave,
      onDelete,
      onClear,
    } = this.props;

    const hasRecipe = Boolean(sourceRecipeTitle);
    const hydration = hydrationPercent(actuals.water, actuals.flour);
    const visibleFields = AMOUNT_FIELDS.filter((field) => {
      if (['flour', 'whiteFlour', 'wholeWheatFlour', 'water', 'salt'].includes(field.key)) {
        return true;
      }
      return actuals[field.key] !== undefined || (formulaActuals && formulaActuals[field.key] !== undefined);
    });

    return (
      <div className="project-editor text-start">
        <h3 className="mb-3">{activeProjectId ? 'Edit project' : 'Save as project'}</h3>

        {!hasRecipe && !activeProjectId ? (
          <p className="text-muted">Select a bread recipe above to start a project.</p>
        ) : null}

        <div className="mb-3">
          <label className="form-label" htmlFor="projectTitle">
            Project title
          </label>
          <input
            id="projectTitle"
            type="text"
            className="form-control"
            placeholder="Saturday country loaf"
            value={projectTitle}
            onChange={onTitleChange}
          />
          {sourceRecipeTitle ? (
            <div className="form-text">Based on {sourceRecipeTitle}</div>
          ) : null}
        </div>

        <div className="mb-3">
          <label className="form-label">Actual amounts (grams)</label>
          <p className="form-text mt-0 mb-2">
            Pre-filled from the formula. Edit if you used different amounts in the bowl.
          </p>
          <div className="row g-2">
            {visibleFields.map((field) => {
              const formulaVal =
                formulaActuals && formulaActuals[field.key] !== undefined
                  ? formulaActuals[field.key]
                  : null;
              const actualVal = actuals[field.key];
              const overridden =
                formulaVal !== null &&
                actualVal !== undefined &&
                Number(actualVal) !== Number(formulaVal);
              return (
                <div className="col-md-6" key={field.key}>
                  <label className="form-label small mb-0" htmlFor={`actual-${field.key}`}>
                    {field.label}
                    {overridden ? (
                      <span className="text-warning ms-1">(formula {formulaVal}g)</span>
                    ) : null}
                  </label>
                  <input
                    id={`actual-${field.key}`}
                    type="number"
                    className="form-control form-control-sm"
                    name={field.key}
                    min="0"
                    step="1"
                    value={actualVal === undefined || actualVal === null ? '' : actualVal}
                    onChange={onActualChange}
                  />
                </div>
              );
            })}
          </div>
          {hydration !== null ? (
            <div className="form-text mt-2">Hydration: {hydration}% (water ÷ flour)</div>
          ) : null}
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="projectNotes">
            Notes
          </label>
          <textarea
            id="projectNotes"
            className="form-control"
            rows="4"
            placeholder="Dough feel, fermentation vs plan, oven spring, crumb, what to change next time…"
            value={notes}
            onChange={onNotesChange}
          />
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-success"
            onClick={onSave}
            disabled={!projectTitle.trim() || !hasRecipe}
          >
            {activeProjectId ? 'Update project' : 'Save project'}
          </button>
          {activeProjectId ? (
            <button type="button" className="btn btn-outline-danger" onClick={onDelete}>
              Delete
            </button>
          ) : null}
          <button type="button" className="btn btn-outline-secondary" onClick={onClear}>
            Clear
          </button>
        </div>
      </div>
    );
  }
}

export default ProjectEditor;
