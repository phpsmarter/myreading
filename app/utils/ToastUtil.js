//toast提示组件的封装
import Toast from 'react-native-root-toast';

let toast;
//短的的提示方法
export function toastShort(content) {
  if (toast !== undefined) {
    Toast.hide(toast);
  }
  toast = Toast.show(content.toString(), {
    duration: Toast.durations.SHORT, //闪现的时间
    position: Toast.positions.BOTTOM,//闪现的位置
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0
  });
}
//长的的提示方法

export function toastLong(content) {
  if (toast !== undefined) {
    Toast.hide(toast);
  }
  toast = Toast.show(content.toString(), {
    duration: Toast.durations.LONG,
    position: Toast.positions.BOTTOM,
    shadow: true,
    animation: true,
    hideOnPress: true,
    delay: 0
  });
}
