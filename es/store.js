import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";

const sagaMiddleware = createSagaMiddleware();
const middleware = [sagaMiddleware];

let store = {};
store.getState = () => ({});
store.subscribe = () => {};

function configureStore(rootReducer, rootSaga, needLogger) {
  if (needLogger) {
    middleware.unshift(logger);
  }

  store = createStore(rootReducer, applyMiddleware(...middleware));
  sagaMiddleware.run(rootSaga);
}

function subscribe(fn) {
  return store.subscribe(fn)
}

function dispatch(obj) {
  store.dispatch(obj)
}

function getState() {
  return store.getState()
}

export { configureStore, subscribe, dispatch, getState };
