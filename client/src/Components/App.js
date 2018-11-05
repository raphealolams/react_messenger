import React, { Component } from 'react';
import UI from './UI'
import Store from '../store'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      store: new Store(this)
    }
  }


  render() {
    const {store} = this.state
    return (
      <div className="app-wrapper">
        <UI store={store}/>
      </div>
    )
  }
}

export default App