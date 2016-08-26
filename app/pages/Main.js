
import React, { PropTypes } from 'react';
import {
  StyleSheet,
  ListView,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  InteractionManager, //交互操作管理器
  ActivityIndicator, //活动指示器
  DrawerLayoutAndroid, //抽屉组件
  Image,
  Dimensions,
  Platform,//操作系统组件
  View
} from 'react-native';
import LoadingView from '../components/LoadingView';//预加载画面
import DrawerLayout from 'react-native-drawer-layout';//兼容ios和android的draw组件
import { fetchArticles } from '../actions/read';
import ReadingToolbar from '../components/ReadingToolbar';//标题栏
import ScrollableTabView, { DefaultTabBar } from 'react-native-scrollable-tab-view';//滑动的Tab显示方法
import About from '../pages/About';//关于的组件
import Feedback from '../pages/Feedback';//反馈的组件
import CategoryContainer from '../containers/CategoryContainer';
import { toastShort } from '../utils/ToastUtil';//短时间提示的组件
import Storage from '../utils/Storage';//本地存储的组件方法封装
import { CATEGORIES } from '../constants/Alias';//分类类型
import WebViewPage from '../pages/WebViewPage';//webview组建的封装

const homeImg = require('../img/home.png');
const categoryImg = require('../img/category.png');
const inspectionImg = require('../img/inspection.png');
const infoImg = require('../img/info.png');
const menuImg = require('../img/menu.png');
const propTypes = {
  dispatch: PropTypes.func.isRequired,
  read: PropTypes.object.isRequired
};

let canLoadMore;
let page = 1;
let loadMoreTime = 0;
//使用listView和DataSource加载文章列表
class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      typeIds: []
    };
    this.renderItem = this.renderItem.bind(this);//渲染条目的方法
    this.renderFooter = this.renderFooter.bind(this);//渲染末尾的方法
    this.renderNavigationView = this.renderNavigationView.bind(this);//渲染导航视图的方法
    this.onIconClicked = this.onIconClicked.bind(this);
    this.onScroll = this.onScroll.bind(this);
    canLoadMore = false;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    InteractionManager.runAfterInteractions(() => {
      Storage.get('typeIds')
        .then((typeIds) => {
          if (!typeIds) {  //如果本地存储里面没有分类信息，默认的typeIds的处理
            typeIds = [0, 12, 9, 2];
          }
          typeIds.forEach((typeId) => {
            dispatch(fetchArticles(false, true, typeId)); //获取文章的dispatch
          });
          this.setState({
            typeIds
          });
        });
    });
  }

  componentWillReceiveProps(nextProps) {
    const { read } = this.props;
    if (read.isLoadMore && !nextProps.read.isLoadMore && !nextProps.read.isRefreshing) {
      if (nextProps.read.noMore) {
        toastShort('没有更多数据了');
      }
    }
  }

  onRefresh(typeId) {
    const { dispatch } = this.props;
    canLoadMore = false;
    dispatch(fetchArticles(true, false, typeId));
  }

  onPress(article) {
    const { navigator } = this.props; //这种写法应该是结构赋值的方法？
    InteractionManager.runAfterInteractions(() => {
      navigator.push({
        component: WebViewPage,
        name: 'WebViewPage',
        article
      });
      //alert(article.title);//打印一下article的内容
    });
  }
 //点击Drawer的操作方法
  onPressDrawerItem(index) {
    const { navigator } = this.props;//这句是什么意思？不懂
    this.refs.drawer.closeDrawer();//点击以后打开相应的组件，及时关闭Drawer
    switch (index) {  //根据index的不同索引数导航到不同的组件去
      case 1:
        InteractionManager.runAfterInteractions(() => {
          navigator.push({
            component: CategoryContainer,
            name: 'Category'
          });
        });
        break;
      case 2:
        InteractionManager.runAfterInteractions(() => {
          navigator.push({
            component: Feedback,
            name: 'Feedback'
          });
        });
        break;
      case 3:
        InteractionManager.runAfterInteractions(() => {
          navigator.push({
            component: About,
            name: 'About'
          });
        });
        break;
      default:
        break;
    }
  }
  //点击图标打开Drawer
  onIconClicked() {
    this.refs.drawer.openDrawer();
  }

  onScroll() {  //这个滚动是什么怎么操作的？
    if (!canLoadMore) {
      canLoadMore = true;
    }
  }

  onEndReached(typeId) { //到达末尾的加载条目加载方法
    const time = Date.parse(new Date()) / 1000;
    if (canLoadMore && time - loadMoreTime > 1) {
      page++; //分页加载数目增加1
      const { dispatch } = this.props;
      dispatch(fetchArticles(false, false, typeId, true, page));
      canLoadMore = false;
      loadMoreTime = Date.parse(new Date()) / 1000;
    }
  }
  //页脚的渲染方法
  renderFooter() {
    const { read } = this.props;
    if (read.isLoadMore) {
      return (
        <View
          style={{ flex: 1, flexDirection: 'row', justifyContent: 'center',
            alignItems: 'center', padding: 5 }}
        >
          <ActivityIndicator size="small" color="#3e9ce9" />
          <Text style={{ textAlign: 'center', fontSize: 16, marginLeft: 10 }}>
            数据加载中……
          </Text>
        </View>
      );
    }
    return null;
  }
  //渲染文章的条目方法
  renderItem(article) {
    return (
       //点击加载文章列表
      <TouchableOpacity onPress={() => this.onPress(article)}>
        <View style={styles.containerItem}>
          <Image
            style={{ width: 88, height: 66, marginRight: 10 }}
            source={{ uri: article.contentImg }}
          />
          <View style={{ flex: 1, flexDirection: 'column' }} >
            <Text style={styles.title}>
              {article.title}
            </Text>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
              <Text style={{ fontSize: 14, color: '#aaaaaa', marginTop: 5 }}>
                来自微信公众号：
              </Text>
              <Text
                style={{ flex: 1, fontSize: 14, color: '#87CEFA',
                  marginTop: 5, marginRight: 5 }}
              >
                {article.userName}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
 //渲染内容
  renderContent(dataSource, typeId) {
    const { read } = this.props;
    if (read.loading) {
      return <LoadingView />;
    }
    const isEmpty = read.articleList[typeId] === undefined || read.articleList[typeId].length === 0;
    if (isEmpty) {
      return (
        <ScrollView
          automaticallyAdjustContentInsets={false}
          horizontal={false}
          contentContainerStyle={styles.no_data}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={read.isRefreshing}
              onRefresh={() => this.onRefresh(typeId)}
              title="Loading..."
              colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
            />
          }
        >
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 16 }}>
              目前没有数据，请刷新重试……
            </Text>
          </View>
        </ScrollView>
      );
    }
    return (
      <ListView
        initialListSize={1}
        dataSource={dataSource}
        renderRow={this.renderItem}
        style={styles.listView}
        onEndReached={() => this.onEndReached(typeId)}
        onEndReachedThreshold={10}
        onScroll={this.onScroll}
        renderFooter={this.renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={read.isRefreshing}
            onRefresh={() => this.onRefresh(typeId)}
            title="Loading..."
            colors={['#ffaa66cc', '#ff00ddff', '#ffffbb33', '#ffff4444']}
          />
        }
      />
    );
  }
  //渲染导航视图
  renderNavigationView() {
    return (
      <View style={[styles.container, { backgroundColor: '#fcfcfc' }]}>
        <View
          style={{ width: Dimensions.get('window').width / 5 * 3, height: 120,
            justifyContent: 'flex-end', paddingBottom: 10, backgroundColor: '#3e9ce9' }}
        >
          <Text style={{ fontSize: 20, textAlign: 'left', color: '#fcfcfc', marginLeft: 10 }}>
            Reading
          </Text>
          <Text style={{ fontSize: 20, textAlign: 'left', color: '#fcfcfc', marginLeft: 10 }}>
            让生活更精彩
          </Text>
        </View>

        <TouchableOpacity
          style={styles.drawerContent}
          onPress={() => this.onPressDrawerItem(0)}
        >
          <Image
            style={styles.drawerIcon}
            source={homeImg}
          />
          <Text style={styles.drawerText}>
            首页
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerContent}
          onPress={() => this.onPressDrawerItem(1)}
        >
          <Image
            style={styles.drawerIcon}
            source={categoryImg}
          />
          <Text style={styles.drawerText}>
            分类
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerContent}
          onPress={() => this.onPressDrawerItem(2)}
        >
          <Image
            style={styles.drawerIcon}
            source={inspectionImg}
          />
          <Text style={styles.drawerText}>
            建议
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.drawerContent}
          onPress={() => this.onPressDrawerItem(3)}
        >
          <Image
            style={styles.drawerIcon}
            source={infoImg}
          />
          <Text style={styles.drawerText}>
            关于
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { read, navigator } = this.props;
    return (
      //Drawer组件
      <DrawerLayout
        ref="drawer"
        drawerWidth={Dimensions.get('window').width / 5 * 3}
        drawerPosition={Platform.OS === 'android' ? DrawerLayoutAndroid.positions.Left : 'left'}
        renderNavigationView={this.renderNavigationView}
      >

        <View style={styles.container}>
          <ReadingToolbar
            title="Reading"
            navigator={navigator}
            navIcon={menuImg}
            onIconClicked={this.onIconClicked}
          />

          <ScrollableTabView
            renderTabBar={() =>
              <DefaultTabBar
                underlineHeight={2}
                textStyle={{ fontSize: 16, marginTop: 6 }}
              />
            }
            tabBarBackgroundColor="#fcfcfc"
            tabBarUnderlineColor="#3e9ce9"
            tabBarActiveTextColor="#3e9ce9"
            tabBarInactiveTextColor="#aaaaaa"
          >
          {this.state.typeIds.map((typeId) => {
            const typeView = (
              <View
                key={typeId}
                tabLabel={CATEGORIES[typeId]}
                style={{ flex: 1 }}
              >
                {this.renderContent(this.state.dataSource.cloneWithRows(
                  read.articleList[typeId] === undefined ? [] : read.articleList[typeId]), typeId)}
              </View>);
            return typeView;
          })}
          </ScrollableTabView>
        </View>
      </DrawerLayout>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  containerItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fcfcfc',
    padding: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1
  },
  title: {
    fontSize: 18,
    textAlign: 'left',
    color: 'black'
  },
  listView: {
    backgroundColor: '#eeeeec'
  },
  no_data: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100
  },
  drawerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  drawerIcon: {
    width: 30,
    height: 30,
    marginLeft: 5
  },
  drawerText: {
    fontSize: 18,
    marginLeft: 15,
    textAlign: 'center',
    color: 'black'
  }
});

Main.propTypes = propTypes;

export default Main;
