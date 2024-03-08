import MyPromise from './promise';

describe('MyPromise', () => {
    it('Should be a constructor', () => {
        expect(typeof MyPromise).toBe('function');
    });
    it('should have a "then" method', () => {
        const promise = new MyPromise();
        expect(typeof promise.then).toBe('function');
    });
    it('should resolve with a value', () => {
        const executor = (resolve) => {
            resolve('This has resolved');
        };
        const promise = new MyPromise(executor);
        const functionToCallWhenPromiseHasBeenResolved = jest.fn();
        promise.then(functionToCallWhenPromiseHasBeenResolved);
        expect(functionToCallWhenPromiseHasBeenResolved).toHaveBeenCalledWith(
            'This has resolved'
        );
    });
});
