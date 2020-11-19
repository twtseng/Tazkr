import React, { Component } from 'react';
import { NavMenu } from './NavMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div className="h-100" style={{padding:0, paddingTop: "70px"}}>
        <NavMenu />
          <div className="h-100 p-0">
            <div className="col-12 h-100 p-0">
            {this.props.children}
            </div>
          </div>
      </div>
    );
  }
}
