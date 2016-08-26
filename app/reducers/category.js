
import * as types from '../constants/ActionTypes';

const initialState = {
  loading: false,
  typeList: {}
};

export default function category(state = initialState, action) {
  //两个异步操作，请求数据和返回数据
  switch (action.type) {
    case types.FETCH_TYPE_LIST:
      return Object.assign({}, state, {
        loading: true //获取列表时，加载LoadingView
      });
    case types.RECEIVE_TYPE_LIST:
      return Object.assign({}, state, {
        loading: false,  //获取数据以后，通过loading=false 让loading消失
        typeList: action.typeList
      });
    default:
      return state;
  }
}
