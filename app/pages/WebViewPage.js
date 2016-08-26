
import React from 'react';
import {
  StyleSheet,
  WebView,
  BackAndroid,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Modal
} from 'react-native';
//dimensions 获取屏幕的宽度也应该放到Utils中去
import ReadingToolbar from '../components/ReadingToolbar';
import { toastShort } from '../utils/ToastUtil';
import LoadingView from '../components/LoadingView';
import { naviGoBack } from '../utils/CommonUtil';
import * as WeChat from 'react-native-wechat';

const shareImg = require('../img/share.png');
const shareIconWechat = require('../img/share_icon_wechat.png');
const shareIconMoments = require('../img/share_icon_moments.png');
let toolbarActions = [
  { title: '分享', icon: shareImg, show: 'always' }
];
let canGoBack = false;

class WebViewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShareModal: false  //modal组件有个属性是visible是用这个state来控制的
    };
    this.onActionSelected = this.onActionSelected.bind(this);
    this.onNavigationStateChange = this.onNavigationStateChange.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.goBack);
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.goBack);
  }
  //点击webview右上角导航的图标时，Modal的状态改为true可以加载modal模块
  onActionSelected() {
    this.setState({
      isShareModal: true
    });
  }

  onNavigationStateChange(navState) {
    canGoBack = navState.canGoBack;
  }
  //如果返回，则改变Modal的状态为false，隐藏起来
  goBack() {
    if (this.state.isShareModal) {
      this.setState({
        isShareModal: false
      });
      return true;
    } else if (canGoBack) {
      this.refs.webview.goBack();
      return true;
    }
    return naviGoBack(this.props.navigator);
  }

  renderLoading() {
    return <LoadingView />;
  }

  renderSpinner() {
    const { route } = this.props;
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.setState({
            isShareModal: false
          });
        }}
      >
        <View
          key={'spinner'}
          style={styles.spinner}
        >
          <View style={styles.spinnerContent}>
            <Text style={[styles.spinnerTitle, { fontSize: 20, color: 'black' }]}>
              分享到
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  WeChat.isWXAppInstalled() //检查微信是否已经安装，后面判断，如果没有安装的提示安装
                    .then((isInstalled) => {
                      if (isInstalled) {
                        WeChat.shareToSession({
                          title: route.article.title,
                          description: '分享自：Reading',
                          thumbImage: route.article.contentImg,
                          type: 'news',
                          webpageUrl: route.article.url
                        })
                        .catch((error) => {
                          toastShort(error.message);
                        });
                      } else {
                        toastShort('没有安装微信软件，请您安装微信之后再试');
                      }
                    });
                }}
              >
                <View style={styles.shareContent}>
                  <Image
                    style={styles.shareIcon}
                    source={shareIconWechat}
                  />
                  <Text style={styles.spinnerTitle}>
                    微信
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => {
                  WeChat.isWXAppInstalled()
                    .then((isInstalled) => {
                      if (isInstalled) {
                        WeChat.shareToTimeline({
                          title: `[@Reading]${route.article.title}`, //由路由传递过来的文章对象进行解析
                          thumbImage: route.article.contentImg,
                          type: 'news',
                          webpageUrl: route.article.url
                        })
                        .catch((error) => {
                          toastShort(error.message);
                        });
                      } else {
                        toastShort('没有安装微信软件，请您安装微信之后再试');
                      }
                    });
                }}
              >
                <View style={styles.shareContent}>
                  <Image
                    style={styles.shareIcon}
                    source={shareIconMoments}
                  />
                  <Text style={styles.spinnerTitle}>
                    朋友圈
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  render() {
    const { navigator, route } = this.props;
    return (
      <View style={styles.container}>
        <ReadingToolbar
          actions={toolbarActions}
          onActionSelected={this.onActionSelected}
          title={route.article.userName}
          navigator={navigator}
        />
        <Modal
          animationType="fade"
          visible={this.state.isShareModal}
          transparent
          onRequestClose={() => {
            this.setState({
              isShareModal: false
            });
          }}
        >
          {this.renderSpinner()}
        </Modal>
        <WebView
          ref="webview"
          automaticallyAdjustContentInsets={false}
          style={{ flex: 1 }}
          source={{ uri: route.article.url }}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          scalesPageToFit
          decelerationRate="normal"
          startInLoadingState
          onShouldStartLoadWithRequest={() => {
            const shouldStartLoad = true;
            return shouldStartLoad;
          }}
          onNavigationStateChange={this.onNavigationStateChange}
          renderLoading={this.renderLoading}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  spinner: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)'
  },
  spinnerContent: {
    justifyContent: 'center',
    width: Dimensions.get('window').width * (7 / 10),
    height: Dimensions.get('window').width * (7 / 10) * 0.68,
    backgroundColor: '#fcfcfc',
    padding: 20,
    borderRadius: 5
  },
  spinnerTitle: {
    fontSize: 18,
    color: '#313131',
    textAlign: 'center',
    marginTop: 5
  },
  shareContent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  shareIcon: {
    width: 40,
    height: 40
  }
});

export default WebViewPage;
