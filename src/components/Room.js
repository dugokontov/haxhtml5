import React from 'react';
import {
    joinGame,
    startRendering,
    keyDown,
    keyUp,
    setOnPlayersChangedCb,
    getPlayers,
    changeTeam,
    startGame,
} from '../hax/client';
import { createGame } from '../hax/server';
import Players from './Players';

class Room extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            players: [],
            roomId: this.props.roomId || '',
        };

        this.canvas = null;
    }

    componentDidMount() {
        if (this.props.roomId) {
            joinGame(
                this.props.wsServer,
                this.props.name,
                this.props.roomId
            ).then(this.startRendering);
        } else {
            createGame(this.props.wsServer).then(roomId => {
                joinGame(
                    this.props.wsServer,
                    this.props.name,
                    roomId
                ).then(() => {
                    this.setState({ roomId });
                    this.startRendering();
                });
            });
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', keyDown);
        document.removeEventListener('keyup', keyUp);
    }

    startRendering = () => {
        startRendering(this.canvas.getContext('2d'));
        document.addEventListener('keydown', keyDown);
        document.addEventListener('keyup', keyUp);
        setOnPlayersChangedCb(this.onPlayerChange);
    };

    onPlayerChange = () => {
        this.setState({ players: getPlayers() });
    };

    render() {
        return (
            <div>
                <canvas
                    ref={ref => (this.canvas = ref)}
                    width="650"
                    height="450"
                />
                <br />
                <label htmlFor="roomId">Room id: </label>
                <input
                    type="text"
                    name="roomId"
                    style={{ width: 300 }}
                    readOnly
                    value={this.state.roomId}
                />
                <hr />
                <Players
                    players={this.state.players}
                    onChangeTeam={changeTeam}
                />
                <button onClick={startGame}>Start game</button>
            </div>
        );
    }
}

export default Room;
