import Game from './Game';
import actions from './Actions';
const INTERVAL = 10; // milliseconds
const ACCEPTABLE_DELAY = 200;

export default class Timeline {
    constructor(ctx) {
        this.actions = actions([]);
        this.game = new Game(ctx);
        this.game.createFieldElements();
        this.game.addPlayers();
        this.game.setInitPosition();
        this.game.displayScore();

        this.lastSnapshotTime = performance.now();
        this.snapShots = {};
        this.snapShots[this.lastSnapshotTime] = this.game.storeState();

        this.handleApplyAction = this.game.applyAction.bind(this.game);

        window.getSnapshot = () => console.log(this.snapShots);
        window.gcOldSnapshots = this.gcOldSnapshots.bind(this);
    }

    registerAction(when, player, type, action) {
        const now = performance.now();
        if (when <= now && when > now - ACCEPTABLE_DELAY) {
            this.actions.addAction(when, player, type, action);
            console.log({ when, player, type, action });
        } else {
            console.log('skip this');
        }
    }

    render() {
        // from when we have to render
        const firstUnappliedAction = this.actions.find(a => !a.applied);
        const currentTime = performance.now();
        let snapshotTime;
        if (
            !firstUnappliedAction ||
            firstUnappliedAction.when > this.lastSnapshotTime
        ) {
            snapshotTime = this.lastSnapshotTime;
        } else {
            // find first snapshot before first action
            const snapshotTimes = Object.keys(this.snapShots)
                .map(time => +time)
                .sort((a, b) => a - b);
            const indexOfFirstInvalidSnapshot = snapshotTimes.findIndex(
                time => time > firstUnappliedAction.when
            );
            // delete all snapshots after first unapplied action
            for (
                let i = snapshotTimes.length - 1;
                i >= indexOfFirstInvalidSnapshot;
                i -= 1
            ) {
                delete this.snapShots[snapshotTimes[i]];
            }
            snapshotTime = snapshotTimes[indexOfFirstInvalidSnapshot - 1];
        }

        const unappliedActions = this.actions.filter(
            a => a.when > snapshotTime
        );

        this.game.restoreState(this.snapShots[snapshotTime]);
        const actionsForThisFrame = a =>
            a.when >= snapshotTime && a.when < snapshotTime + INTERVAL;
        while (currentTime > snapshotTime + INTERVAL) {
            unappliedActions
                .filter(actionsForThisFrame)
                .forEach(this.handleApplyAction);
            this.game.acceleratePlayers();
            this.game.deceleratePlayers();
            this.game.decelerateBall();
            this.game.interact();
            this.game.move();
            this.snapShots[snapshotTime] = this.game.storeState();
            snapshotTime += INTERVAL;
        }

        if (this.actions.find(a => !a.applied && a.when < snapshotTime)) {
            debugger;
        }

        this.lastSnapshotTime = snapshotTime;
        this.snapShots[this.lastSnapshotTime] = this.game.storeState();
        this.game.render();
    }

    gcOldSnapshots() {
        let currentTime = performance.now();
        let numberOfDeleted = 0;
        for (var index in this.snapShots) {
            if (+index < currentTime - 5000) {
                numberOfDeleted += 1;
                delete this.snapShots[index];
            }
        }
        window.getSnapshot();
        console.log(`deleted ${numberOfDeleted} snapshots`);
    }
}
