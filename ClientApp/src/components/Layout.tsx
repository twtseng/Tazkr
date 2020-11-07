import React, { Component } from 'react';
import { NavMenu } from './NavMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div className="h-100" style={{paddingTop: "70px"}}>
        <NavMenu />
          <div className="h-100">
            <div className="col-12 h-100">
            {this.props.children}
            </div>
          </div>
      </div>
    );
  }
}
