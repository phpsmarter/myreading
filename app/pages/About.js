
import React from 'react';
import {
  StyleSheet,
  Image,
  Text,
  Linking,
  View
} from 'react-native';

import ReadingToolbar from '../components/ReadingToolbar';
import Button from '../components/Button';
import DeviceInfo from 'react-native-device-info'; //设备信息

let API_STORE = 'http://apistore.baidu.com/';
let READING_REPO = 'https://github.com/attentiveness/reading';

const adoutLogo = require('../img/about_logo.png');

class About extends React.Component {
  onPress(url) {
    Linking.openURL(url);
  }

  render() {
    const { navigator } = this.props;//这个方法看不懂
    return (
      <View style={styles.container}>
        <ReadingToolbar
          title="关于"
          navigator={navigator}
        />
        <View style={styles.content}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image
              style={{ width: 110, height: 110, marginTop: 50 }}
              source={adoutLogo}
            />
            <Text style={{ fontSize: 16, textAlign: 'center', color: '#aaaaaa', marginTop: 5 }}>
              {`v${DeviceInfo.getVersion()}`}
            </Text>
            <Text style={{ fontSize: 35, textAlign: 'center', color: '#313131', marginTop: 10 }}>
              Reading
            </Text>
            <Text style={{ fontSize: 18, textAlign: 'center', color: '#4e4e4e' }}>
              让生活更精彩
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <View style={{ flexDirection: 'column' }}>
              <Text style={{ fontSize: 14, textAlign: 'center', color: '#999999' }}>
                免责声明：所有内容均来自——
              </Text>
              <Button
                style={{ fontSize: 14, textAlign: 'center', color: '#3e9ce9' }}
                text={API_STORE}
                onPress={() => this.onPress(API_STORE)}
              />
            </View>
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <Text style={{ fontSize: 12, textAlign: 'center', color: '#aaaaaa' }}>
                @Github：
              </Text>
              <Button
                style={{ fontSize: 12, textAlign: 'center', color: '#3e9ce9' }}
                text={READING_REPO}
                onPress={() => this.onPress(READING_REPO)}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    backgroundColor: '#fcfcfc',
    justifyContent: 'center',
    paddingBottom: 10
  }
});

export default About;
