import React from 'react';
import RadioTeam from './RadioTeam';

class Players extends React.Component {
    render() {
        const players = this.props.players.map(player =>
            <tr key={player.id}>
                <td>
                    {player.name}
                </td>
                <td>
                    <RadioTeam
                        team="a"
                        player={player}
                        onChangeTeam={this.props.onChangeTeam}
                    />
                </td>
                <td>
                    <RadioTeam
                        team="b"
                        player={player}
                        onChangeTeam={this.props.onChangeTeam}
                    />
                </td>
            </tr>
        );
        return (
            <table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Red</td>
                        <td>Blue</td>
                    </tr>
                </thead>
                <tbody>
                    {players}
                </tbody>
            </table>
        );
    }
}

export default Players;
