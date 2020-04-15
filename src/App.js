import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import BreadSelect from './Control/BreadSelect';

class App extends Component {
  constructor(props) {
    super(props); 
        this.state = {
          flour: [],
          bread: []
    };
  }   

  componentDidMount() { 
        //Get current Bread Data
    
        axios.get('http://localhost:3000/breadRecipes.json')
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
        <header className="App-header">
          <h1>For Bread Baking</h1>
        </header>
        <div className="form-group">
            <label className="form-label">Choose a Bread</label>
              <select className="form-control"  id="formSelect">
                <option default>Select a Bread</option>
                <BreadSelect bread={this.state.bread} />
              </select>  
        </div>
      </div>
  );
}
}

export default App;

