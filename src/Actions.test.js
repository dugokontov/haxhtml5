import actions from './Actions';

it('should augment array', () => {
    const ary = actions([]);
    expect(ary.addAction).not.toBe(undefined);
});

describe('adding elements at positions: 1, 2, 2', () => {
    const ary = actions([]);
    it('should add element at the beginning', () => {
        ary.addAction(123, 1, 0, 'up');
        expect(ary.length).toBe(1);
    });
    it('should add element at the end', () => {
        ary.addAction(456, 1, 0, 'up');
        expect(ary.length).toBe(2);
        expect(ary[1].when).toBe(456);
    });
    it('should add element in the middle', () => {
        ary.addAction(234, 1, 0, 'down');
        expect(ary.length).toBe(3);
        expect(ary[1].when).toBe(234);
    });
});

describe('adding elements at positions: 1, 1, 1', () => {
    const ary = actions([]);
    it('should add element at the beginning', () => {
        ary.addAction(123, 1, 0, 'up');
        expect(ary.length).toBe(1);
    });
    it('should add second element at the beginning', () => {
        ary.addAction(122, 1, 0, 'up');
        expect(ary.length).toBe(2);
        expect(ary[0].when).toBe(122);
        expect(ary[1].when).toBe(123);
    });
    it('should add third element at the beginning', () => {
        ary.addAction(121, 1, 0, 'down');
        expect(ary.length).toBe(3);
        expect(ary[0].when).toBe(121);
        expect(ary[1].when).toBe(122);
        expect(ary[2].when).toBe(123);
    });
});

describe('mark as non applied', () => {
    const ary = actions([]);
    it('should mark as non applied after we add', () => {
        ary.addAction(123, 1, 0, 'up');
        expect(ary[0].applied).toBe(false);
        ary.addAction(456, 1, 0, 'left');
        expect(ary[1].applied).toBe(false);
    });
});
