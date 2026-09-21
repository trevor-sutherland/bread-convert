import React, { Component } from 'react';

class ProjectList extends Component {
  render() {
    const { projects, activeProjectId, onSelect, onNew, onExport, onImportFile } = this.props;
    const sorted = (projects || []).slice().sort((a, b) => {
      const aTime = a.updatedAt || a.createdAt || '';
      const bTime = b.updatedAt || b.createdAt || '';
      return bTime.localeCompare(aTime);
    });

    return (
      <div className="project-list text-start">
        <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
          <h3 className="mb-0">Bread projects</h3>
          <div className="btn-group">
            <button type="button" className="btn btn-sm btn-primary" onClick={onNew}>
              New project
            </button>
            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={onExport}>
              Export
            </button>
            <label className="btn btn-sm btn-outline-secondary mb-0">
              Import
              <input
                type="file"
                accept="application/json,.json"
                className="d-none"
                onChange={onImportFile}
              />
            </label>
          </div>
        </div>
        {sorted.length === 0 ? (
          <p className="text-muted mb-0">
            No saved bakes yet. Choose a recipe, set flour, then save a project with notes and
            actual amounts.
          </p>
        ) : (
          <ul className="list-group">
            {sorted.map((project) => {
              const isActive = project.id === activeProjectId;
              const dateLabel = (project.updatedAt || project.createdAt || '').slice(0, 10);
              return (
                <li
                  key={project.id}
                  className={`list-group-item list-group-item-action ${isActive ? 'active' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelect(project.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelect(project.id);
                    }
                  }}
                >
                  <div className="d-flex gap-2 align-items-start">
                    {project.photo ? (
                      <img
                        className="project-list-thumb"
                        src={project.photo}
                        alt=""
                      />
                    ) : null}
                    <div className="flex-grow-1 min-w-0">
                      <div className="fw-bold">{project.title || 'Untitled bake'}</div>
                      <small className={isActive ? '' : 'text-muted'}>
                        {dateLabel}
                        {project.sourceRecipeTitle ? ` · ${project.sourceRecipeTitle}` : ''}
                      </small>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    );
  }
}

export default ProjectList;
