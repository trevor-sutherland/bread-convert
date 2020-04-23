import React, { Component } from 'react';

class Flour extends Component {

    render(){
		return(
            <div className="form-group">
                  <label htmlFor="flour">Flour</label>
                  <input 
                    type="number" 
                    className="form-control"
                    id="flour"
                    name="flour"
                    step="50"
                    placeholder="currently 500"
                    value={this.props.flour} 
                    onChange={this.props.changeFlour}
                  />
            </div>        
		);
}
}
export default Flour;