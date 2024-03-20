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

MyPromise.resolve = (result) => {
    function executor(functionToResolveThePromise) {
        functionToResolveThePromise(result);
    }
    return new MyPromise(executor);
};

MyPromise.reject = (value) => {
    return new MyPromise((resolve, reject) => {
        reject(value);
    });
};

MyPromise.all = function (arrayOfPromises) {
    return MyPromise.resolve([]);
};
export default MyPromise;
