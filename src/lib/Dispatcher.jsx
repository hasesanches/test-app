// import {Dispatcher} from 'flux';
//
// export default new Dispatcher();

import Flux from "flux";

const Dispatcher = new Flux.Dispatcher();

Dispatcher.deferDispatch = function (value) {
    if (Dispatcher.isDispatching() === true) {
        setTimeout(() => Dispatcher.dispatch(value));
    } else Dispatcher.dispatch(value);
};

export default Dispatcher;