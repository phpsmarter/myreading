
import React, { PropTypes } from 'react';
import {
  InteractionManager,
  StyleSheet,
  Text,
  View
} from 'react-native';

import ReadingToolbar from '../components/ReadingToolbar';//导航栏
import { fetchTypes } from '../actions/category';
import Storage from '../utils/Storage';
import GridView from '../components/GridView';
import Button from '../components/Button';
import { toastShort } from '../utils/ToastUtil';
import MainContainer from '../containers/MainContainer';
import { CATEGORIES } from '../constants/Alias'; //默认的目录，

const checkIno = require('../img/check.png');
let toolbarActions = [
  { title: '提交', icon: checkIno, show: 'always' }
];
let tempTypeIds = [];

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  category: PropTypes.object.isRequired
};

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.renderItem = this.renderItem.bind(this);//列出分类项目的列表
    this.onActionSelected = this.onActionSelected.bind(this); //弹出卡片的方法
    this.resetRoute = this.resetRoute.bind(this);  //重置路由的方法
    this.state = {
      typeIds: tempTypeIds
    };
  }
  //从本地存储获取到已经存储的typeIds，并设置到State中
  componentWillMount() {
    Storage.get('typeIds')
      .then((typeIds) => {
        tempTypeIds = typeIds;
        this.setState({
          typeIds
        });
      });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchTypes());
  }
  //单个分类按钮的点击函数
  onPress(type) {
    const pos = tempTypeIds.indexOf(parseInt(type.id));
    //alert(pos); //打印一下选取的分类的位置
    if (pos === -1) {
      tempTypeIds.push(parseInt(type.id));//如果没被选取的话，pos为-1,push到tempTypeIds中
    } else {
      tempTypeIds.splice(pos, 1);//如果不为-1就从tempTypeIds中去掉
    }
    this.setState({
      typeIds: tempTypeIds
    });
    //alert(this.state.typeIds);  //获取选取的目录id
  }
  //总的确认函数，右上角的对号
  onActionSelected() {
    if (tempTypeIds.length > 5) {
      toastShort('不要超过5个类别哦');
      return;
    }
    if (tempTypeIds.length < 3) {
      toastShort('不要少于3个类别哦');
      return;
    }
    const { navigator } = this.props;
    InteractionManager.runAfterInteractions(() => {
      Storage.get('typeIds')
        .then((typeIds) => {  //从本地数据库获取typeIds,如果和tempTypeIds一样就直接返回，不再存储。否则就更新本地的typeIds的数据
          if (typeIds.sort().toString() === Array.from(tempTypeIds).sort().toString()) {
            navigator.pop();
            return;
          }
          Storage.save('typeIds', this.state.typeIds)
                  .then(this.resetRoute);
        });
    });
  }
  //resetRoute 没有看懂,似乎是重置路由？
  //应该是重新返回主页面的操作方法
  resetRoute() {
    const { navigator } = this.props;
    navigator.resetTo({
      component: MainContainer,
      name: 'Main'
    });
  }

  renderItem(item) {
    //渲染分类项目的button时候，如果 indexOf 是不是-1渲染出不一样的样式
    const isSelect = Array.from(this.state.typeIds).indexOf(parseInt(item.id)) !== -1;
    return (
      <Button
        key={item.id}
        containerStyle={[{ margin: 10, padding: 10, borderRadius: 10,
          borderWidth: 1, borderColor: '#dddddd' },
          isSelect ? { backgroundColor: '#3e9ce9' } : { backgroundColor: '#fcfcfc' }]}
        style={[{ fontSize: 16, textAlign: 'center' },
          isSelect ? { color: '#fcfcfc' } : { color: 'black' }]}
        text={CATEGORIES[item.id]}
        onPress={() => this.onPress(item)}
      />
    );
  }

  render() {
    const { navigator, category } = this.props;
    return (
      <View style={styles.container}>
        <ReadingToolbar
          title="分类"
          actions={toolbarActions}
          navigator={navigator}
          onActionSelected={this.onActionSelected}
        />
        <View style={{ padding: 10, backgroundColor: '#fcfcfc' }}>
          <Text style={{ color: 'black', fontSize: 16 }}>
            选择您感兴趣的3-5个类别
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#f2f2f2' }}>
          <GridView
            items={Array.from(category.typeList)}
            itemsPerRow={4}
            renderItem={this.renderItem}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  }
});

Category.propTypes = propTypes;

export default Category;
