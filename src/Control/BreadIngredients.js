import React, { Component } from 'react';
import Yeast from './Yeast'
import Leaven from './Leaven'

class Breadingredients extends Component {

    render(){
        if (this.props.recipe === undefined) return(<div className="row justify-content-md-center" className="container" className="lead">All numbers are based on 100% assumption</div>);
        if (!this.props.recipe.ingredients) return (<div className="row justify-content-md-center" className="container" className="lead">All numbers are based on 100% assumption</div>);
        if (this.props.recipe.ingredients.yeast === NaN) {
            return
        }
        
		return(
            <div className="list-group">
                <h3>
                    {this.props.recipe.title}
                    <small className="text-muted"><br />{this.props.recipe.type}</small>
                </h3>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item"><b>White Flour:</b> {Math.round((this.props.recipe.ingredients.whiteFlour /100 * this.props.flour) * 100 / 100)}</li>
                    <li className="list-group-item"><b>Whole Wheat Flour</b> {Math.round((this.props.recipe.ingredients.wholeWheatFlour /100 * this.props.flour) * 100 / 100)}</li>
                    <li className="list-group-item"><b>Water</b> {Math.round((this.props.recipe.ingredients.water /100 * this.props.flour) * 100 / 100)}</li>  
                    {this.props.recipe.ingredients.leaven
                        ? <Leaven recipe={this.props.recipe} flour={this.props.flour} />
                        : <Yeast recipe={this.props.recipe} flour={this.props.flour}/>
                    }
                    <li className="list-group-item"><b>Salt</b> {Math.round((this.props.recipe.ingredients.salt /100 * this.props.flour) * 100 / 100)}</li>
                </ul>
            </div>
		);
}
}
export default Breadingredients;