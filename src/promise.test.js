import MyPromise from './promise';

jest.spyOn(global, 'setTimeout');

describe('MyPromise', () => {
    it('Should be a constructor', () => {
        expect(typeof MyPromise).toBe('function');
    });
    it('should have a "then" method', () => {
        const promise = new MyPromise();
        expect(typeof promise.then).toBe('function');
    });
    describe('given a promise that resolve immediately', () => {
        it('should resolve with a value', () => {
            const executor = (resolve) => {
                resolve('This has resolved');
            };
            const promise = new MyPromise(executor);
            const functionToCallWhenPromiseHasBeenResolved = jest.fn();
            promise.then(functionToCallWhenPromiseHasBeenResolved);
            expect(
                functionToCallWhenPromiseHasBeenResolved
            ).toHaveBeenCalledWith('This has resolved');
        });
    });

    describe('given a promise that resolves after some time', () => {
        beforeAll(() => {
            jest.useFakeTimers();
        });

        afterAll(() => {
            jest.useRealTimers();
        });
        describe('and the callback is registered before it resolves', () => {
            it('calls the registered callback when it resolves', () => {
                const executor = (resolve) => {
                    setTimeout(() => {
                        resolve('This has resolved');
                    }, 1000);
                };
                const myPromise = new MyPromise(executor);
                const functionToCallWhenPromiseHasBeenResolved = jest.fn();
                myPromise.then(functionToCallWhenPromiseHasBeenResolved);
                jest.runAllTimers();
                expect(
                    functionToCallWhenPromiseHasBeenResolved
                ).toHaveBeenCalledWith('This has resolved');
            });
        });
    });
});
