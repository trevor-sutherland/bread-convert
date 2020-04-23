import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import BreadSelect from './Control/BreadSelect';
import BreadRecipe from './Control/BreadIngredients';
import Flour from './Control/Flour';
import Breadingredients from './Control/BreadIngredients';
import BreadPreperation from './Control/BreadPreperation';

class App extends Component {
  constructor(props) {
    super(props); 
        this.state = {
          flour: [500],
          bread: [],
          recipe: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleBreadState = this.handleBreadState.bind(this);
    this.changeFlour = this.changeFlour.bind(this);
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
    
  }

  render()  {
    

    return (
      <div className="App">
        {/* <header className="App-header">
          <h1>For Bread Baking</h1>
          <img src={logo} className="App-logo" alt="logo" />
        </header> */}
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

