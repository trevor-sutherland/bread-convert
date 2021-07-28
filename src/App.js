import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Bread from './Control/Bread';
import BreadSelect from './Control/BreadSelect';
import Flour from './Control/Flour';
import Breadingredients from './Control/BreadIngredients';
import BreadPreperation from './Control/BreadPreperation';

class App extends Component {
  constructor(props) {
    super(props); 
        this.state = {
          flour: [500],
          bread: [],
          recipe: [],
          breadLogo: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleBreadState = this.handleBreadState.bind(this);
    this.changeFlour = this.changeFlour.bind(this);
    this.getLogo = this.getLogo.bind(this);
}; 

  handleChange (e) {
    const options = e.target.value;
    this.setState(
      {
        selectedBreadTitle: options
      }, 
      this.handleBreadState
      );
      
  };

  getLogo () {
  axios.get('https://api.unsplash.com/photos/random', {
    params: {
    client_id: 'Tu4EqFZ28zGqh07es4ssr7Lpczsn7sEpcmgxJqESliQ',
    query: 'bread'
    }
  })
  .then((response) => {
    this.setState({
      breadLogo: response.data.urls.full
    })
    console.log(response.data.urls.full);
  })
  }
  //Create single bread object to pass down.

  handleBreadState = () => {
    const selectedBreadTitle = this.state.selectedBreadTitle;
    const recipe = this.state.bread.find(item=> item.title === selectedBreadTitle);
    this.setState({
      recipe: recipe
    },
    this.handleIngredientsState
    );
  };
  
  //Set flour 
  
  changeFlour(e){
    this.setState({
    [e.target.name]: e.target.value
    })
    }

 componentDidMount() { 
        
    //Get current Bread Data
    axios.get('/breadRecipes.json')
    .then((response) => {
          this.setState({
          bread: response.data
        })
      })
        
    .catch((error) =>console.log(error));
    this.getLogo();
  }

  render()  {
    

    return (
      <div className="App">
        <header className="App-header">
          <h1>For Bread Baking</h1>
          <img src={this.state.breadLogo} className="App-logo" alt="logo" />
        </header>
        <div className="container">
          <div className="row">
            <div className="col">
              <form>
                <div className="form-group">
                  <label className="form-label">Choose a Bread</label>
                    <select className="form-control"  id="formSelect" onChange={(e) => this.handleChange(e)}>
                      <option default>Select a Bread</option>
                      <BreadSelect bread={this.state.bread} /> 
                    </select>
                </div>    
                  <Flour flour={this.props.bread} changeFlour={(e) => this.changeFlour(e)}/>
              </form>
            </div>  
            <div className="col">
                <Breadingredients ingredients={this.state.ingredients} recipe={this.state.recipe} flour={this.state.flour} />
            </div>
                <Bread ingredients={this.state.ingredients} recipe={this.state.recipe} flour={this.state.flour} />
          </div>
          <div className="row">  
            <div className="col">
            <BreadPreperation ingredients={this.state.ingredients} recipe={this.state.recipe} flour={this.state.flour} />
            </div>
          </div>
        </div>
      </div>   
  );
}
}

export default App;

