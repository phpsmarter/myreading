
//导航返回的方法
export function naviGoBack(navigator) {
  if (navigator && navigator.getCurrentRoutes().length > 1) {
    navigator.pop();
    return true;
  }
  return false;
}
//空对象的判断
export function isEmptyObject(obj) {
  for (const name in obj) {
    if ({}.hasOwnPropetry.call(obj, name)) {
      return false;
    }
  }
  return true;
}
