//这个文件不动，可以作为模板文件使用
import { combineReducers } from 'redux';
import read from './read'; //几个需要修改的地方
import category from './category'; //

const rootReducer = combineReducers({
  read, //
  category //
});

export default rootReducer;
