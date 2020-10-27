import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

export class Layout extends Component {
  static displayName = Layout.name;

  render () {
    return (
      <div className="contentbox">
        <NavMenu />
          <div className="row content">
            <div className="col-10 bg-light">
              {this.props.children}
            </div>
            <div className="col-2 border rounded">

            </div>
          </div>
      </div>
    );
  }
}
