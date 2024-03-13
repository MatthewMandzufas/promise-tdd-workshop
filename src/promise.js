const STATE = {
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
    PENDING: 'pending',
};
function MyPromise(executor = () => {}) {
    this.then = function (functionToCallWhenPromiseHasBeenResolved) {
        if (this.state === STATE.FULFILLED) {
            functionToCallWhenPromiseHasBeenResolved(this.result);
        } else {
            this.functionToCallWhenPromiseHasBeenResolved =
                functionToCallWhenPromiseHasBeenResolved;
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
    this.state = STATE.PENDING;
    executor(this.functionToResolveThePromise);
}

export default MyPromise;
