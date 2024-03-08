import MyPromise from './promise';

describe('MyPromise', () => {
    it('Should be a constructor', () => {
        expect(typeof MyPromise).toBe('function');
    });
    it('should have a "then" method', () => {
        const promise = new MyPromise();
        expect(typeof promise.then).toBe('function');
    });
});
