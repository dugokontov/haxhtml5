import React, { Component } from 'react';
import Looby from './components/Looby';
import Room from './components/Room';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            wsServer: undefined,
            name: undefined,
            roomId: undefined,
        };
    }

    onJoin = (wsServer, name, roomId) => {
        this.setState({ wsServer, name, roomId });
    };

    render() {
        const { wsServer, name, roomId } = this.state;
        if (wsServer) {
            return <Room wsServer={wsServer} name={name} roomId={roomId} />;
        }

        return <Looby onJoin={this.onJoin} />;
    }
}

export default App;
