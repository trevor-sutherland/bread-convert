import React, { Component } from 'react';

class Yeast extends Component {
    render(){ 
		return(
           <li className="list-group-item"><b>Yeast</b> {Math.round((this.props.recipe.ingredients.yeast /100 * this.props.flour) * 100 / 100)}</li>
		);
        }
    }

export default Yeast;