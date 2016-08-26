//加载启动页的图片组件，这个组件应该叫闪现
import React from 'react';
import {
  Dimensions,
  Image,
  InteractionManager
} from 'react-native';

import MainContainer from '../containers/MainContainer';

const maxHeight = Dimensions.get('window').height;//获取高度
const maxWidth = Dimensions.get('window').width;//获取屏幕的宽度
const splashImg = require('../img/splash.png'); //启动页的图片

class Splash extends React.Component {
  componentDidMount() {
    const { navigator } = this.props;
    //设置定时器为加载两秒
    this.timer = setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        navigator.resetTo({
          component: MainContainer,
          name: 'Main'
        });
      });
    }, 2000); //加载一次的定时器
  }
  //清除定时器，卸载组件
  componentWillUnmount() {
    clearTimeout(this.timer);  //清除定时器
  }

  render() {
    return (
      <Image
        style={{ width: maxWidth, height: maxHeight }}
        source={splashImg}
      />
    );
  }
}

export default Splash;
