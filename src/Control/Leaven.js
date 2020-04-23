import React, { Component } from 'react';

class Leaven extends Component {
    render(){ 
		return(
           <li className="list-group-item"><b>Leaven</b> {Math.round((this.props.recipe.ingredients.leaven /100 * this.props.flour) * 100 / 100)}</li>
		);
        }
    }

export default Leaven;