import React, { Component } from 'react';

//Renders bread select dropdown

class BreadSelect extends Component {

  renderItems() {
    return this.props.bread.map((item) => (
      <option key={item.title} value={item.title}>
      {item.title}
      </option>  
      ));
    }

  render() {
      return (
      <React.Fragment>
        {this.renderItems()}
      </React.Fragment>  
      );
  }
}

export default BreadSelect;