const STATE = {
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
    PENDING: 'pending',
};
function MyPromise(executor = () => {}) {
    this.then = function (
        functionToCallWhenPromiseHasBeenResolved,
        functionToCallWhenPromiseHasBeenRejected
    ) {
        if (this.state === STATE.FULFILLED) {
            functionToCallWhenPromiseHasBeenResolved(this.result);
        } else if (this.state === STATE.REJECTED) {
            functionToCallWhenPromiseHasBeenRejected(this.result);
        } else {
            this.functionToCallWhenPromiseHasBeenResolved =
                functionToCallWhenPromiseHasBeenResolved;
            this.functionToCallWhenPromiseHasBeenRejected =
                functionToCallWhenPromiseHasBeenRejected;
        }
    };
    this.functionToResolveThePromise = (result) => {
        if (this.state === STATE.PENDING) {
            this.result = result;
            this.state = STATE.FULFILLED;
            if (this.functionToCallWhenPromiseHasBeenResolved) {
                this.functionToCallWhenPromiseHasBeenResolved(result);
            }
        }
    };

    this.functionToRejectThePromise = (result) => {
        if (this.state === STATE.PENDING) {
            this.result = result;
            this.state = STATE.REJECTED;
            if (this.functionToCallWhenPromiseHasBeenRejected) {
                this.functionToCallWhenPromiseHasBeenRejected(result);
            }
        }
    };

    this.state = STATE.PENDING;
    executor(this.functionToResolveThePromise, this.functionToRejectThePromise);
}

MyPromise.resolve = (value) => {
    return new MyPromise((resolve, reject) => {
        resolve(value);
    });
};
MyPromise.reject = (value) => {
    return new MyPromise((resolve, reject) => {
        reject(value);
    });
};

MyPromise.all = function (arrayOfPromises) {
    const arrayOfResults = [];
    let rejectedPromiseResult;
    let isRejected = false;
    for (let i = 0; i < arrayOfPromises.length && !isRejected; i++) {
        arrayOfPromises[i].then(
            (resolvedValue) => {
                arrayOfResults[i] = resolvedValue;
            },
            (rejectValue) => {
                rejectedPromiseResult = rejectValue;
                isRejected = true;
            }
        );
    }
    if (isRejected) {
        return MyPromise.reject(rejectedPromiseResult);
    }
    return MyPromise.resolve(arrayOfResults);
};

MyPromise.allSettled = function (arrayOfPromises) {
    const arrayOfResults = [];
    for (let i = 0; i < arrayOfPromises.length; i++) {
        arrayOfPromises[i].then(
            (resolvedValue) => {
                arrayOfResults[i] = {
                    status: 'fulfilled',
                    value: resolvedValue,
                };
            },
            (rejectValue) => {
                arrayOfResults[i] = {
                    status: 'rejected',
                    reason: rejectValue,
                };
            }
        );
    }
    return MyPromise.resolve(arrayOfResults);
};
export default MyPromise;
