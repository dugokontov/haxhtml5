import React, { Component } from 'react';
import hax from './hax';

class App extends Component {
  componentDidMount() {
    hax(this.canvas.getContext('2d'));
  }

  render() {
    return (
      <canvas
        ref={ref => this.canvas = ref}
        width="600"
        height="400"
      />
    );
  }
}

export default App;
