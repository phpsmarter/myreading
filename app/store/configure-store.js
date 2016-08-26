
import { createStore, applyMiddleware } from 'redux';  //redux的组件
import thunk from 'redux-thunk';  //异步操作的redux-thunk组件
import rootReducer from '../reducers/index';//combineReducers的reducers

const middlewares = [thunk];
const createLogger = require('redux-logger');

if (process.env.NODE_ENV === 'development') {
  const logger = createLogger();
  middlewares.push(logger);
}
const createStoreWithMiddleware = applyMiddleware(...middlewares)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(rootReducer, initialState);

  return store;
}
