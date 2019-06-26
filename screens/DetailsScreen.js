import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList
} from 'react-native';
import axios from 'axios';
import * as Animatable from 'react-native-animatable';
import Constants from '../Constants';
import Transection from './components/Transection';

const arrow = require('./images/arrow.png');
const refresh = require('./images/refresh.png');

class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    balance: 'loading',
    pending: 'loading',
    loading: true,
    loadingData: true,
    networkError: false,
    showTxns: 1,
    listData: []
  }

  componentDidMount() {
    this.getDisplayData(() => {
      this.getTxns(false);
    });
  }

  getDisplayData = (callback) => {
    this.setState({ loading: true, networkError: false });
    const { navigation } = this.props;
    const address = navigation.getParam('address', 'EMPTY_ADDRESS_GOT_PASSED_SOMEHOW');
    const type = navigation.getParam('type', 'BTCTEST');
    let url = Constants.FETCH_ADDRESS_DETAILS;
    url = url.replace('$TYPE', type);
    url = url.replace('$ADDRESS', address);
    axios.get(url).then((response) => {
      const { data } = response.data;
      this.setState({ balance: data.balance, pending: data.pending_value, loading: false });
      if (callback) callback();
    }).catch((e) => {
      // eslint-disable-next-line no-console
      console.log(e);
      this.setState({ networkError: 'Something went wrong :( Try Again!', loading: false });
    });
  }

  getTxnUrl = (haveLastTxn, type) => {
    switch (type) {
      case 1: return haveLastTxn
        ? Constants.FETCH_RECIEVED_TRANSECTIONS_CONTINUE : Constants.FETCH_RECIEVED_TRANSECTIONS;
      case 2: return haveLastTxn
        ? Constants.FETCH_SPENT_TRANSECTIONS_CONTINUE : Constants.FETCH_SPENT_TRANSECTIONS;
      default: return Constants.FETCH_RECIEVED_TRANSECTIONS;
    }
  }

  getTxns = (haveLastTxn) => {
    this.setState({ loadingData: true, networkError: false });
    const { navigation } = this.props;
    const { listData, showTxns } = this.state;
    const address = navigation.getParam('address', 'EMPTY_ADDRESS_GOT_PASSED_SOMEHOW');
    const type = navigation.getParam('type', 'BTCTEST');
    let url = this.getTxnUrl(haveLastTxn, showTxns);
    url = url.replace('$TYPE', type);
    url = url.replace('$ADDRESS', address);
    url = haveLastTxn ? url.replace('$LAST', haveLastTxn) : url;
    axios.get(url).then((response) => {
      const { data } = response.data;
      if (haveLastTxn) {
        this.setState({ listData: listData.concat(data.txs), loadingData: false });
      } else this.setState({ listData: data.txs, loadingData: false });
    }).catch((e) => {
      // eslint-disable-next-line no-console
      console.log(e);
      this.setState({ networkError: 'Something went wrong :( Try Again!', loadingData: false });
    });
  }

  handleTop = () => {
    this.flatListRef.scrollToOffset({ animated: true, offset: 0 });
    this.topIcon.transitionTo({ rotate: '360deg' }, 1000);
    setTimeout(() => {
      this.topIcon.transitionTo({ rotate: '0deg' }, 10);
    }, 1000);
  }

  handleRefresh = () => {
    this.getDisplayData();
    this.refreshIcon.rotate(500);
  }

  loadMore = () => {
    const { listData } = this.state;
    const last = listData[listData.length - 1];
    this.getTxns(last.txid);
  }

  handleListUpdate = (type) => {
    this.setState({ showTxns: type, listData: [] }, () => {
      this.getTxns(false);
    });
  }

  render() {
    const { navigation } = this.props;
    const address = navigation.getParam('address', 'EMPTY_ADDRESS_GOT_PASSED_SOMEHOW');
    const type = navigation.getParam('type', 'BTCTEST');
    const {
      balance, pending, loading, showTxns, listData, loadingData,
      networkError
    } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" animated />
        <View style={styles.containerScroller}>
          <View style={styles.topBar}>
            <View style={styles.barContainer}>
              <View>
                <Text style={styles.heading}>
                  {`Address (${type})`}
                </Text>
                <Text style={styles.content}>
                  {address}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View>
                  <Text style={styles.heading}>
                    {'Balance Amount'}
                  </Text>
                  <Text style={styles.content}>
                    {balance}
                  </Text>
                </View>
                <View style={{ flex: 1 }} />
                <View>
                  <Text style={styles.heading}>
                    {'Pending Amount'}
                  </Text>
                  <Text style={styles.content}>
                    {pending}
                  </Text>
                </View>
              </View>
              {
                loading && (
                  <ActivityIndicator animating color="rgb(0, 125, 255)" size="small" />
                )
              }
            </View>
          </View>

          <View style={styles.listMenuContainer}>
            <TouchableOpacity style={styles.button} onPress={this.handleTop} activeOpacity={0.5}>
              <Animatable.Image
                source={arrow}
                style={styles.icon}
                ref={(ref) => { this.topIcon = ref; }}
              />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              style={styles.listOption1}
              activeOpacity={0.4}
              onPress={() => this.handleListUpdate(1)}
            >
              <Text style={showTxns === 1 ? styles.optionTextSelected : styles.optionText}>
                {'Recieved'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.listOption3}
              activeOpacity={0.4}
              onPress={() => this.handleListUpdate(2)}
            >
              <Text style={showTxns === 2 ? styles.optionTextSelected : styles.optionText}>
                {'    Sent    '}
              </Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              style={styles.button}
              onPress={this.handleRefresh}
              activeOpacity={0.5}
            >
              <Animatable.Image
                source={refresh}
                iterationCount="infinite"
                style={styles.icon}
                ref={(ref) => { this.refreshIcon = ref; }}
              />
            </TouchableOpacity>
          </View>
          {
            listData.length === 0 && !loadingData && (
              <View>
                <Text style={styles.emptyText}>
                  {'No active transections found.'}
                </Text>
              </View>
            )
          }
          <FlatList
            ref={(ref) => { this.flatListRef = ref; }}
            style={styles.list}
            keyExtractor={(item, index) => `${index}`}
            data={listData}
            extraData={listData}
            onEndReachedThreshold={0}
            onEndReached={this.loadMore}
            renderItem={({ item }) => <Transection item={item} txnType={showTxns} />}
          />
          {
            loadingData && (
              <ActivityIndicator animating color="white" size="small" />
            )
          }
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(0, 155, 255)',
  },
  containerScroller: {
    flex: 1,
    justifyContent: 'center'
  },
  topBar: {
    backgroundColor: 'white',
    flexDirection: 'row',
    padding: 5,
  },
  barContainer: {
    width: '100%',
    marginTop: 40
  },
  heading: {
    color: '#909090',
    fontSize: 14
  },
  content: {
    fontSize: 15,
    marginBottom: 5,
    color: 'rgb(0, 155, 255)'
  },
  listMenuContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5
  },
  optionText: {
    fontSize: 14,
    color: '#333'
  },
  optionTextSelected: {
    fontSize: 14,
    color: 'rgb(0, 125, 255)'
  },
  listOption1: {
    backgroundColor: '#fff',
    padding: 5,
    margin: 5,
    justifyContent: 'center',
    marginRight: 0,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8
  },
  listOption3: {
    backgroundColor: '#fff',
    padding: 5,
    margin: 5,
    marginLeft: 2,
    justifyContent: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8
  },
  list: {
    flex: 1
  },
  button: {
    borderRadius: 32,
    height: 32,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: 32
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: 'white'
  },
  emptyText: {
    textAlign: 'center',
    margin: 10,
    fontSize: 14,
    color: '#fff'
  }
});

export default HomeScreen;
