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
            <Container className="col-12">
            {this.props.children}
            </Container>
          </div>
      </div>
    );
  }
}
