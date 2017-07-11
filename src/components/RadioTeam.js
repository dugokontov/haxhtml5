import React from 'react';

class RadioTeam extends React.Component {
    onChange = () => {
        const { player, team, onChangeTeam } = this.props;
        onChangeTeam(player, team);
    };

    render() {
        const { player, team } = this.props;
        return (
            <input
                type="radio"
                checked={player.team === team}
                onChange={this.onChange}
            />
        );
    }
}

export default RadioTeam;
