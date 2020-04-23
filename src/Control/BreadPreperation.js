import React, { Component } from 'react';
import Yeast from './Yeast'
import Leaven from './Leaven'

class BreadPreperation extends Component {

    render(){
        if (this.props.recipe === undefined) return(<div className="row justify-content-md-center" className="container" className="display-4">Preperation instructions will appear when you choose a bread!</div>);
        if (!this.props.recipe.preperation) return (<div className="row justify-content-md-center" className="container" className="display-4">Preperation instructions will appear when you choose a bread!</div>);
        console.log(this.props.recipe.preperation);
        if (this.props.recipe.ingredients.yeast === NaN) {
            return
        }
        
		return(
            <div className="list-group">
                <table class="table table-striped">
                    <thead class="thead-dark">
                        <tr>
                        <th scope="col">Type</th>
                        <th scope="col">Time</th>
                        <th scope="col">Temperature</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <th scope="row">Autolyse</th>
                        <td>{this.props.recipe.preperation.autolyse.time} minutes</td>
                        <td>{this.props.recipe.preperation.autolyse.temperature} F</td>
                        </tr>
                        <tr>
                        <th scope="row">Bulk Fermentation</th>
                        <td>{this.props.recipe.preperation.bulkFermentation.time} hours</td>
                        <td>{this.props.recipe.preperation.bulkFermentation.temperature} F</td>
                        </tr>
                        <tr>
                        <th scope="row">Proof</th>
                        <td>{this.props.recipe.preperation.proof.time} hours</td>
                        <td>{this.props.recipe.preperation.proof.temperature} F</td>
                        </tr>
                        <tr>
                        <th scope="row">Bake</th>
                        <td>{this.props.recipe.preperation.bake.time} minutes</td>
                        <td>{this.props.recipe.preperation.bake.temperature} F</td>
                        </tr>
                        <tr>
                        <th scope="row">Total</th>
                        <td>{this.props.recipe.preperation.total} hours</td>
                        <td>---</td>
                        </tr>
                    </tbody>
                    </table>
            </div>
		);
}
}
export default BreadPreperation;