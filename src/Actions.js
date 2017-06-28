export default function createActions(ary) {
    Object.defineProperty(ary, 'addAction', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function(when, player, type, action) {
            let indexOfNewAction = ary.length - 1;
            while (indexOfNewAction >= 0 && ary[indexOfNewAction].when > when) {
                indexOfNewAction -= 1;
            }
            ary.splice(indexOfNewAction + 1, 0, {
                when,
                player,
                type,
                action,
                applied: false,
            });
        },
    });
    return ary;
}
