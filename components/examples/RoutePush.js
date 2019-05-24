// Demonstrate that the Router functions work as you would expect
import React, { Component } from 'react'
import Router from 'next/router'

export default class RoutePush extends Component {
  handleClick = (href) => {
    Router.push(href)
  }

  render = () => (
    <button onClick={this.handleClick.bind(this, this.props.href)}>
      {this.props.children}
    </button>
  )
}

export class RouteBack extends Component {
  handleClick = () => {
    Router.back()
  }

  render = () => (
    <button onClick={this.handleClick.bind(this, this.props.href)}>
      {this.props.children}
    </button>
  )
}

export class RouteReplace extends Component {
  handleClick = (href) => {
    Router.replace(href)
  }

  render = () => (
    <button onClick={this.handleClick.bind(this, this.props.href)}>
      {this.props.children}
    </button>
  )
}

export class Redirect extends Component {
  componentDidMount () {
    // console.log('redirecting to.', this.props.href)
    this.props.href && Router.replace(this.props.href)
  }

  handleClick = (href) => {
    Router.replace(href)
  }

  render = () => (
    <button onClick={this.handleClick.bind(this, this.props.href)}>
      {this.props.children}
    </button>
  )
}
