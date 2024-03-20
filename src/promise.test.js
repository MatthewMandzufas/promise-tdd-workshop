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
    describe('given a promise that resolves', () => {
        describe('immediately', () => {
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
        describe('after some time', () => {
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
            describe('and the callback is registered after it resolves', () => {
                it('calls the registered callback immediately', () => {
                    const executor = (resolve) => {
                        setTimeout(() => {
                            resolve('This has resolved');
                        }, 1000);
                    };
                    const myPromise = new MyPromise(executor);
                    jest.runAllTimers();
                    const functionToCallWhenPromiseHasBeenResolved = jest.fn();
                    myPromise.then(functionToCallWhenPromiseHasBeenResolved);
                    expect(
                        functionToCallWhenPromiseHasBeenResolved
                    ).toHaveBeenCalledWith('This has resolved');
                });
            });
        });
    });
    describe('given a promise that rejects', () => {
        describe('immediately', () => {
            it('calls the registered callback', () => {
                const executor = (resolve, reject) => {
                    reject('This has rejected');
                };
                const myPromise = new MyPromise(executor);
                const functionToCallWhenPromiseHasBeenRejected = jest.fn();
                myPromise.then(
                    undefined,
                    functionToCallWhenPromiseHasBeenRejected
                );
                expect(
                    functionToCallWhenPromiseHasBeenRejected
                ).toHaveBeenCalledWith('This has rejected');
            });
        });
        beforeAll(() => {
            jest.useFakeTimers();
        });
        afterAll(() => {
            jest.useRealTimers();
        });
        describe('after some time', () => {
            describe('and the callback is registered before it rejects', () => {
                it('should call the registered callback after it rejects', () => {
                    const executor = (resolve, reject) => {
                        setTimeout(() => {
                            reject();
                        }, 1000);
                    };

                    const functionToCallWhenPromiseHasBeenRejected = jest.fn();
                    const myPromise = new MyPromise(executor);

                    myPromise.then(
                        undefined,
                        functionToCallWhenPromiseHasBeenRejected
                    );
                    expect(
                        functionToCallWhenPromiseHasBeenRejected
                    ).not.toHaveBeenCalled();
                    jest.runAllTimers();
                    expect(
                        functionToCallWhenPromiseHasBeenRejected
                    ).toHaveBeenCalled();
                });
            });
            describe('and the callback is registered after it rejects', () => {
                it('should call the registered callback immediately', () => {
                    const executor = (resolve, reject) => {
                        setTimeout(() => {
                            reject('This has rejected');
                        }, 1000);
                    };
                    const myPromise = new MyPromise(executor);
                    const functionToCallWhenPromiseHasBeenRejected = jest.fn();
                    jest.runAllTimers();
                    myPromise.then(
                        undefined,
                        functionToCallWhenPromiseHasBeenRejected
                    );

                    expect(
                        functionToCallWhenPromiseHasBeenRejected
                    ).toHaveBeenCalledWith('This has rejected');
                });
            });
        });
    });
    it('returns a promise that is immediately resolved to a value', () => {
        const myResolvedPromise = MyPromise.resolve('Resolved');
        expect(myResolvedPromise).toBeInstanceOf(MyPromise);
        expect(myResolvedPromise.state).toBe('fulfilled');
        expect(myResolvedPromise.result).toBe('Resolved');
    });
    it('returns a promise that is immediately rejected to a value', () => {
        const functionToCallWhenPromiseHasBeenRejected = jest.fn();
        const rejectedPromise = MyPromise.reject('Rejected');

        rejectedPromise.then(
            undefined,
            functionToCallWhenPromiseHasBeenRejected
        );
        expect(rejectedPromise).toBeInstanceOf(MyPromise);
        expect(functionToCallWhenPromiseHasBeenRejected).toHaveBeenCalledWith(
            'Rejected'
        );
    });
    describe('given an array of promises passed to MyPromise.all()', () => {
        it('resolves to an empty array, given an empty array', () => {
            const arrayOfPromises = [];
            const callback = jest.fn();
            const newPromise = MyPromise.all(arrayOfPromises);
            newPromise.then(callback);
            expect(newPromise).toBeInstanceOf(MyPromise);
            expect(callback).toHaveBeenCalledWith([]);
        });
        it('resolves to an array of results, given all promises resolve', () => {
            const arrayOfPromises = [
                MyPromise.resolve(1),
                MyPromise.resolve(2),
                MyPromise.resolve(3),
            ];
            const callback = jest.fn();
            const myPromise = MyPromise.all(arrayOfPromises);
            myPromise.then(callback);
            expect(myPromise).toBeInstanceOf(MyPromise);
            expect(callback).toHaveBeenCalledWith([1, 2, 3]);
        });
        it('rejects if any promise rejects', () => {
            const arrayOfPromises = [
                MyPromise.resolve(1),
                MyPromise.reject('Rejected'),
                MyPromise.resolve(2),
            ];
            const myPromise = MyPromise.all(arrayOfPromises);
            const rejectCallback = jest.fn();
            myPromise.then(undefined, rejectCallback);
            expect(rejectCallback).toHaveBeenCalledWith('Rejected');
            expect(myPromise).toBeInstanceOf(MyPromise);
        });
        it('resolves to an iterable of results matching the order of promises in the iterable', () => {
            jest.useFakeTimers();
            const callback = jest.fn();
            const promises = [
                MyPromise.resolve(1),
                new MyPromise((resolve) => {
                    setTimeout(() => {
                        resolve(2);
                    }, 1000);
                }),
                MyPromise.resolve(3),
            ];
            const myPromise = MyPromise.all(promises);
            myPromise.then(callback);
            jest.runAllTimers();
            expect(callback).toHaveBeenCalledWith([1, 2, 3]);
            jest.useRealTimers();
        });
    });
});
