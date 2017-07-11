import React from 'react';

class Looby extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            wsServer: 'ws://10.0.1.193:8081',
            name: '',
            roomId: '',
        };
    }

    onWsServerChange = e => {
        this.setState({ wsServer: e.nativeEvent.target.value });
    };

    onNameChange = e => {
        this.setState({ name: e.nativeEvent.target.value });
    };

    onRoomIdChange = e => {
        this.setState({ roomId: e.nativeEvent.target.value });
    };

    onCreate = () => {
        this.props.onJoin(this.state.wsServer, this.state.name);
    };

    onJoin = () => {
        this.props.onJoin(
            this.state.wsServer,
            this.state.name,
            this.state.roomId
        );
    };

    render() {
        return (
            <div>
                <label htmlFor="wsServer">WS server: </label>
                <input
                    type="text"
                    name="wsServer"
                    value={this.state.wsServer}
                    onChange={this.onWsServerChange}
                />
                <br />
                <label htmlFor="name">Name: </label>
                <input
                    type="text"
                    name="name"
                    value={this.state.name}
                    onChange={this.onNameChange}
                />
                <br />
                <button
                    onClick={this.onCreate}
                    disabled={
                        this.state.name.length === 0 ||
                        this.state.name.wsServer === 0
                    }
                >
                    Create
                </button>{' '}
                or
                <hr />
                <label htmlFor="roomId">Room id: </label>
                <input
                    type="text"
                    name="roomId"
                    value={this.state.roomId}
                    onChange={this.onRoomIdChange}
                />
                <button
                    onClick={this.onJoin}
                    disabled={
                        this.state.name.length === 0 ||
                        this.state.name.wsServer === 0 ||
                        this.state.roomId.length === 0
                    }
                >
                    Join
                </button>
            </div>
        );
    }
}

export default Looby;
