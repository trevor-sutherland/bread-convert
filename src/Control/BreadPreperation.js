import React, { Component } from 'react';
import Yeast from './Yeast'
import Leaven from './Leaven'

const STEPS = ['autolyse', 'bulkFermentation', 'proof', 'bake'];
const STEP_LABELS = {
    autolyse: 'Autolyse',
    bulkFermentation: 'Bulk Fermentation',
    proof: 'Proof',
    bake: 'Bake',
};

function hasTime(value) {
    return value !== '' && value !== null && value !== undefined && !Number.isNaN(Number(value));
}

function formatStepTime(step) {
    if (!step || !hasTime(step.time)) return '—';
    const unit = step.unit || 'hours';
    return `${step.time} ${unit}`;
}

function formatTemperature(step) {
    if (!step || step.temperature === '' || step.temperature === null || step.temperature === undefined) {
        return '—';
    }
    return `${step.temperature} F`;
}

/** Convert a preparation step time to hours for totaling. */
function stepTimeInHours(step) {
    if (!step || !hasTime(step.time)) return 0;
    const time = Number(step.time);
    const unit = step.unit || 'hours';
    return unit === 'minutes' ? time / 60 : time;
}

function formatTotalHours(hours) {
    const rounded = Math.round(hours * 10) / 10;
    return Number.isInteger(rounded) ? `${rounded} hours` : `${rounded} hours`;
}

class BreadPreperation extends Component {

    render(){
        if (this.props.recipe === undefined) return(<div className="row justify-content-md-center" className="container" className="display-4">Preperation instructions will appear when you choose a bread!</div>);
        if (!this.props.recipe.preperation) return (<div className="row justify-content-md-center" className="container" className="display-4">Preperation instructions will appear when you choose a bread!</div>);
        console.log(this.props.recipe.preperation);
        if (this.props.recipe.ingredients.yeast === NaN) {
            return
        }

        const prep = this.props.recipe.preperation;
        const totalHours = STEPS.reduce((sum, key) => sum + stepTimeInHours(prep[key]), 0);
        
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
                        {STEPS.map((key) => (
                        <tr key={key}>
                        <th scope="row">{STEP_LABELS[key]}</th>
                        <td>{formatStepTime(prep[key])}</td>
                        <td>{formatTemperature(prep[key])}</td>
                        </tr>
                        ))}
                        <tr>
                        <th scope="row">Total</th>
                        <td>{formatTotalHours(totalHours)} <small className="text-muted">(sum of steps above)</small></td>
                        <td>—</td>
                        </tr>
                    </tbody>
                    </table>
            </div>
		);
}
}
export default BreadPreperation;
