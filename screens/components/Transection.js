import React from 'react';
import {
  Text,
  View,
  StyleSheet
} from 'react-native';


class Transection extends React.Component {
  state = {

  }

  getType = (type) => {
    switch (type) {
      case 1: return 'Recieved';
      case 2: return 'Sent';
      case 3: return 'Pending';
      default: return 'Recieved';
    }
  }

  getTextStyle = (type) => {
    switch (type) {
      case 1: return styles.content1;
      case 2: return styles.content2;
      case 3: return styles.content3;
      default: return styles.content;
    }
  }

  getMonth = (month) => {
    switch (month) {
      case 0: return 'Jan';
      case 1: return 'Feb';
      case 2: return 'Mar';
      case 3: return 'Apr';
      case 4: return 'May';
      case 5: return 'Jun';
      case 6: return 'Jul';
      case 7: return 'Aug';
      case 8: return 'Sep';
      case 9: return 'Oct';
      case 10: return 'Nov';
      case 11: return 'Dec';
      default: return 'Jan';
    }
  }

  parseTime = (time) => {
    const date = new Date(time * 1000);
    return `${date.getDate()}-${this.getMonth(date.getMonth())}-${date.getFullYear()} :: ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
  }

  render() {
    const { item, txnType } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>
          {'Transectioin ID'}
        </Text>
        <Text style={styles.content} numberOfLines={1}>
          {item.txid}
        </Text>
        <Text style={styles.heading}>
          {`Amount ${this.getType(txnType)}`}
        </Text>
        <Text style={this.getTextStyle(txnType)} numberOfLines={1}>
          {item.value}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <Text style={item.confirmations === 0 ? styles.notConfirmed : styles.confirmed}>
            {item.confirmations === 0 ? 'Not Confirmed' : 'Confirmed'}
          </Text>

          <View style={{ flex: 1 }} />
          <Text style={styles.time}>
            {this.parseTime(item.time)}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff'
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
  content1: {
    fontSize: 15,
    marginBottom: 5,
    color: 'green'
  },
  content2: {
    fontSize: 15,
    marginBottom: 5,
    color: 'red'
  },
  content3: {
    fontSize: 15,
    marginBottom: 5,
    color: 'yellow'
  },
  confirmed: {
    fontSize: 14,
    color: '#909090',
    marginRight: 10
  },
  notConfirmed: {
    fontSize: 14,
    color: 'purple',
    marginRight: 10
  },
  time: {
    fontSize: 14,
    color: 'rgb(255, 125, 0)',
    marginLeft: 10
  }
});

export default Transection;
