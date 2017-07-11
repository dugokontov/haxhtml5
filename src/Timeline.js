import Game from './Game';
import actions from './Actions';
const INTERVAL = 10; // milliseconds
const ACCEPTABLE_DELAY = 200;

export default class Timeline {
    constructor() {
        this.actions = actions([]);
        this.game = new Game();
        this.game.createFieldElements();

        this.lastSnapshotTime = 0;
        this.snapShots = {};
        this.snapShots[this.lastSnapshotTime] = this.game.storeState();

        this.handleApplyAction = this.game.applyAction.bind(this.game);
    }

    loadActions(actions) {
        actions.forEach(({ when, player, type, action }) => {
            this.actions.addAction(when, player, type, action);
        });
    }

    registerAction({ when, player, type, action }, timeCorrection) {
        if (timeCorrection === undefined) {
            this.actions.addAction(when, player, type, action);
            return;
        }
        const now = performance.now() + timeCorrection;
        if (when <= now + ACCEPTABLE_DELAY && when > now - ACCEPTABLE_DELAY) {
            this.actions.addAction(when, player, type, action);
            console.log({ when, player, type, action });
        } else {
            console.log('skip this');
        }
    }

    getSafeSnapshot() {
        const safeSnapshotTime = performance.now() - ACCEPTABLE_DELAY;
        // find first snapshot before first action
        const snapshotTimes = Object.keys(this.snapShots)
            .map(time => +time)
            .sort((a, b) => a - b);
        let timeOfSafeSnapshot = snapshotTimes.find(
            time => time > safeSnapshotTime
        );
        if (timeOfSafeSnapshot == null) {
            timeOfSafeSnapshot = snapshotTimes
                .reverse()
                .find(time => time < safeSnapshotTime);
        }
        const snapshot = this.snapShots[timeOfSafeSnapshot];

        // get all actions after safe snapshot
        const actions = this.actions.filter(
            action => action.when > timeOfSafeSnapshot
        );

        return { snapshot, actions };
    }

    getPlayers() {
        return this.game.getPlayers();
    }

    render(ctx, timeCorrection) {
        // from when we have to render
        const firstUnappliedAction = this.actions.find(a => !a.applied);
        const currentTime = performance.now() + timeCorrection;
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
        this.game.render(ctx);
    }
}
