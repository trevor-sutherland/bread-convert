const STORAGE_KEY = 'breadConvert.projects';

function safeParse(raw) {
  try {
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

export function loadProjects() {
  if (typeof localStorage === 'undefined') return [];
  return safeParse(localStorage.getItem(STORAGE_KEY));
}

export function saveProjects(projects) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function createProjectId() {
  const stamp = new Date().toISOString().slice(0, 10);
  const rand = Math.random().toString(36).slice(2, 7);
  return `proj-${stamp}-${rand}`;
}

/** Download projects as a JSON file for backup. */
export function exportProjectsJson(projects) {
  const blob = new Blob([JSON.stringify(projects, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `bread-projects-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Parse an imported JSON file into a projects array.
 * Accepts a bare array or `{ projects: [...] }`.
 */
export function parseImportedProjects(text) {
  const data = JSON.parse(text);
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.projects)) return data.projects;
  throw new Error('Import file must be a JSON array of projects');
}
