import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import BreadSelect from './Control/BreadSelect';
import Flour from './Control/Flour';
import Breadingredients from './Control/BreadIngredients';
import BreadPreperation from './Control/BreadPreperation';
import ProjectList from './Control/ProjectList';
import ProjectEditor from './Control/ProjectEditor';
import { scaleRecipeToActuals } from './scaleIngredients';
import {
  loadProjects,
  saveProjects,
  createProjectId,
  exportProjectsJson,
  parseImportedProjects,
} from './projectStorage';

const emptyActuals = () => ({
  flour: 500,
  whiteFlour: 0,
  wholeWheatFlour: 0,
  water: 0,
  salt: 0,
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flour: 500,
      bread: [],
      recipe: undefined,
      breadLogo: '',
      selectedBreadTitle: '',
      projects: loadProjects(),
      activeProjectId: null,
      projectTitle: '',
      notes: '',
      actuals: emptyActuals(),
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleBreadState = this.handleBreadState.bind(this);
    this.changeFlour = this.changeFlour.bind(this);
    this.getLogo = this.getLogo.bind(this);
    this.handleProjectTitleChange = this.handleProjectTitleChange.bind(this);
    this.handleNotesChange = this.handleNotesChange.bind(this);
    this.handleActualChange = this.handleActualChange.bind(this);
    this.handleSaveProject = this.handleSaveProject.bind(this);
    this.handleDeleteProject = this.handleDeleteProject.bind(this);
    this.handleClearProject = this.handleClearProject.bind(this);
    this.handleSelectProject = this.handleSelectProject.bind(this);
    this.handleNewProject = this.handleNewProject.bind(this);
    this.handleExportProjects = this.handleExportProjects.bind(this);
    this.handleImportFile = this.handleImportFile.bind(this);
  }

  persistProjects(projects) {
    saveProjects(projects);
    this.setState({ projects });
  }

  seedActualsFromRecipe(recipe, flour) {
    return scaleRecipeToActuals(recipe, flour);
  }

  handleChange(e) {
    const options = e.target.value;
    this.setState(
      {
        selectedBreadTitle: options,
        activeProjectId: null,
      },
      this.handleBreadState
    );
  }

  getLogo() {
    axios
      .get('https://api.unsplash.com/photos/random', {
        params: {
          client_id: 'Tu4EqFZ28zGqh07es4ssr7Lpczsn7sEpcmgxJqESliQ',
          query: 'bread',
        },
      })
      .then((response) => {
        this.setState({
          breadLogo: response.data.urls.full,
        });
      })
      .catch(() => {
        // Image is optional; calculator still works without it.
      });
  }

  handleBreadState = () => {
    const selectedBreadTitle = this.state.selectedBreadTitle;
    const recipe = this.state.bread.find((item) => item.title === selectedBreadTitle);
    const flour = this.state.flour;
    const actuals = recipe ? this.seedActualsFromRecipe(recipe, flour) : emptyActuals();
    this.setState({
      recipe: recipe,
      actuals,
      projectTitle: recipe
        ? `${recipe.title.replace(/\s*\([^)]*\)\s*$/, '')} bake`
        : '',
    });
  };

  changeFlour(e) {
    const flour = e.target.value === '' ? '' : Number(e.target.value);
    const recipe = this.state.recipe;
    const actuals =
      recipe && recipe.ingredients
        ? this.seedActualsFromRecipe(recipe, flour || 0)
        : { ...this.state.actuals, flour: flour || 0 };
    this.setState({
      flour,
      actuals,
    });
  }

  handleProjectTitleChange(e) {
    this.setState({ projectTitle: e.target.value });
  }

  handleNotesChange(e) {
    this.setState({ notes: e.target.value });
  }

  handleActualChange(e) {
    const { name, value } = e.target;
    const num = value === '' ? '' : Number(value);
    this.setState((prev) => {
      const actuals = { ...prev.actuals, [name]: num };
      const next = { actuals };
      if (name === 'flour' && value !== '') {
        next.flour = Number(value);
      }
      return next;
    });
  }

  handleSaveProject() {
    const {
      projectTitle,
      notes,
      actuals,
      recipe,
      activeProjectId,
      projects,
    } = this.state;
    if (!projectTitle.trim() || !recipe || !recipe.title) return;

    const now = new Date().toISOString();
    const existing = activeProjectId
      ? projects.find((p) => p.id === activeProjectId)
      : null;

    const project = {
      id: existing ? existing.id : createProjectId(),
      title: projectTitle.trim(),
      sourceRecipeTitle: recipe.title,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now,
      notes: notes || '',
      flour: Number(actuals.flour) || 0,
      whiteFlour: Number(actuals.whiteFlour) || 0,
      wholeWheatFlour: Number(actuals.wholeWheatFlour) || 0,
      water: Number(actuals.water) || 0,
      salt: Number(actuals.salt) || 0,
    };

    if (actuals.leaven !== undefined && actuals.leaven !== '') {
      project.leaven = Number(actuals.leaven) || 0;
    }
    if (actuals.yeast !== undefined && actuals.yeast !== '') {
      project.yeast = Number(actuals.yeast) || 0;
    }
    ['milk', 'eggs', 'butter', 'sugar'].forEach((key) => {
      if (actuals[key] !== undefined && actuals[key] !== '') {
        project[key] = Number(actuals[key]) || 0;
      }
    });

    let nextProjects;
    if (existing) {
      nextProjects = projects.map((p) => (p.id === existing.id ? project : p));
    } else {
      nextProjects = [project, ...projects];
    }

    this.persistProjects(nextProjects);
    this.setState({
      activeProjectId: project.id,
      flour: project.flour,
    });
  }

  handleDeleteProject() {
    const { activeProjectId, projects } = this.state;
    if (!activeProjectId) return;
    if (!window.confirm('Delete this bread project?')) return;
    const nextProjects = projects.filter((p) => p.id !== activeProjectId);
    this.persistProjects(nextProjects);
    this.handleClearProject();
  }

  handleClearProject() {
    const flour = this.state.flour || 500;
    const recipe = this.state.recipe;
    this.setState({
      activeProjectId: null,
      projectTitle: recipe && recipe.title
        ? `${recipe.title.replace(/\s*\([^)]*\)\s*$/, '')} bake`
        : '',
      notes: '',
      actuals: recipe ? this.seedActualsFromRecipe(recipe, flour) : emptyActuals(),
    });
  }

  handleNewProject() {
    this.handleClearProject();
    this.setState({ activeProjectId: null });
  }

  handleSelectProject(projectId) {
    const project = this.state.projects.find((p) => p.id === projectId);
    if (!project) return;

    const recipe = this.state.bread.find((item) => item.title === project.sourceRecipeTitle);
    const actuals = {
      flour: project.flour,
      whiteFlour: project.whiteFlour,
      wholeWheatFlour: project.wholeWheatFlour,
      water: project.water,
      salt: project.salt,
    };
    if (project.leaven !== undefined) actuals.leaven = project.leaven;
    if (project.yeast !== undefined) actuals.yeast = project.yeast;
    ['milk', 'eggs', 'butter', 'sugar'].forEach((key) => {
      if (project[key] !== undefined) actuals[key] = project[key];
    });

    this.setState({
      activeProjectId: project.id,
      projectTitle: project.title,
      notes: project.notes || '',
      flour: project.flour,
      selectedBreadTitle: project.sourceRecipeTitle || '',
      recipe: recipe,
      actuals,
    });
  }

  handleExportProjects() {
    exportProjectsJson(this.state.projects);
  }

  handleImportFile(e) {
    const file = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = parseImportedProjects(String(reader.result));
        const byId = {};
        this.state.projects.forEach((p) => {
          byId[p.id] = p;
        });
        imported.forEach((p) => {
          if (p && p.id) byId[p.id] = p;
        });
        const merged = Object.values(byId);
        this.persistProjects(merged);
      } catch (err) {
        window.alert('Could not import projects. Use a JSON export from this app.');
      }
    };
    reader.readAsText(file);
  }

  componentDidMount() {
    axios
      .get(`${process.env.PUBLIC_URL}/breadRecipes.json`)
      .then((response) => {
        this.setState({
          bread: response.data,
        });
      })
      .catch((error) => console.log(error));
    this.getLogo();
  }

  render() {
    const recipe = this.state.recipe;
    const formulaActuals =
      recipe && recipe.ingredients
        ? scaleRecipeToActuals(recipe, this.state.flour)
        : emptyActuals();

    return (
      <div className="App">
        <header className="App-header">
          <h1>For Bread Baking</h1>
          {this.state.breadLogo ? (
            <img src={this.state.breadLogo} className="App-logo" alt="Fresh bread" />
          ) : null}
        </header>
        <div className="container">
          <div className="row g-4 text-start">
            <div className="col-lg-4">
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="formSelect">
                    Choose a Bread
                  </label>
                  <select
                    className="form-select"
                    id="formSelect"
                    value={this.state.selectedBreadTitle || ''}
                    onChange={this.handleChange}
                  >
                    <option value="">Select a Bread</option>
                    <BreadSelect bread={this.state.bread} />
                  </select>
                </div>
                <Flour flour={this.state.flour} changeFlour={this.changeFlour} />
              </form>
              <div className="mt-4">
                <Breadingredients recipe={this.state.recipe} flour={this.state.flour} />
              </div>
            </div>

            <div className="col-lg-4">
              <ProjectEditor
                projectTitle={this.state.projectTitle}
                notes={this.state.notes}
                actuals={this.state.actuals}
                formulaActuals={formulaActuals}
                sourceRecipeTitle={recipe && recipe.title}
                activeProjectId={this.state.activeProjectId}
                onTitleChange={this.handleProjectTitleChange}
                onNotesChange={this.handleNotesChange}
                onActualChange={this.handleActualChange}
                onSave={this.handleSaveProject}
                onDelete={this.handleDeleteProject}
                onClear={this.handleClearProject}
              />
            </div>

            <div className="col-lg-4">
              <ProjectList
                projects={this.state.projects}
                activeProjectId={this.state.activeProjectId}
                onSelect={this.handleSelectProject}
                onNew={this.handleNewProject}
                onExport={this.handleExportProjects}
                onImportFile={this.handleImportFile}
              />
            </div>
          </div>

          <div className="row mt-4">
            <div className="col">
              <BreadPreperation recipe={this.state.recipe} flour={this.state.flour} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
