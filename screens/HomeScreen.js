import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import Constants from '../Constants';

class HomeScreen extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    address: '',
    error: false,
    networkError: false,
    loading: false,
    type: 'BTCTEST'
  }

  handleExplore = () => {
    const { type, address } = this.state;
    this.setState({ loading: true, error: false, networkError: false });
    if (address !== '' && address && address.length > 16) {
      let url = Constants.IS_VALID_ADDRESS;
      url = url.replace('$TYPE', type);
      url = url.replace('$ADDRESS', address);
      axios.get(url).then((response) => {
        const { data } = response.data;
        if (data.is_valid) {
          this.setState({ loading: false, error: null });
          const { navigation } = this.props;
          navigation.navigate('Details', {
            address, type
          });
        } else {
          this.setState({ loading: false, error: 'It\'s not a valid address' });
        }
      }).catch((e) => {
        // eslint-disable-next-line no-console
        console.log(e);
        this.setState({ networkError: 'Something went wrong :( Check you network!', loading: false });
      });
    } else {
      this.setState({ error: 'Please enter a valid address!', loading: false });
    }
  }

  handleSample = () => {
    this.setState({ type: 'BTCTEST', address: 'mmJbnPqEAzuUPu3H2MDVRti8pXPj8QTJBj' });
  }

  handleClear = () => {
    this.setState({
      type: 'BTCTEST', error: null, loading: false, address: ''
    });
  }

  render() {
    const {
      type, address, loading, error, networkError
    } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.containerScroller}>
          <StatusBar backgroundColor="transaprent" barStyle="light-content" />
          <Text style={styles.headingStyle}>
            {
            'LastBit Xplorer'
          }
          </Text>
          <Text style={styles.sloganStyle}>
            {
          'Explore your blockchain address'
        }
          </Text>
          <TextInput
            placeholder="Your Bitcoin addresss"
            style={styles.inputStyle}
            placeholderTextColor="#dfdfdf"
            value={address}
            onChangeText={newAddress => this.setState({ address: newAddress })}
          />

          <View style={styles.optionContainerStyle}>
            <TouchableOpacity style={styles.optionStyle} activeOpacity={0.4} onPress={() => this.setState({ type: 'DOGETEST' })}>
              <Text style={type === 'DOGETEST' ? styles.optionTextStyle : { color: '#909090' }}>
                {'Dogecoin'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionStyle} activeOpacity={0.4} onPress={() => this.setState({ type: 'BTCTEST' })}>
              <Text style={type === 'BTCTEST' ? styles.optionTextStyle : { color: '#909090' }}>
                {'Bitcoin'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionStyle} activeOpacity={0.4} onPress={() => this.setState({ type: 'LTCTEST' })}>
              <Text style={type === 'LTCTEST' ? styles.optionTextStyle : { color: '#909090' }}>
                {'Litecoin'}
              </Text>
            </TouchableOpacity>
          </View>
          {
            loading && (
              <ActivityIndicator animating={loading} size="small" style={styles.loading} color="white" />
            )
          }

          {
            (error || networkError) && (
            <Text style={styles.error}>
              {error || networkError}
            </Text>
            )}
          <TouchableOpacity style={styles.button} activeOpacity={0.4} onPress={this.handleExplore}>
            <View style={styles.buttonView}>
              <Text style={styles.buttonText}>
                {'Explore'}
              </Text>
            </View>
          </TouchableOpacity>
        </ScrollView>
        <View style={styles.floating}>
          <TouchableOpacity style={styles.popup} activeOpacity={0.5} onPress={this.handleSample}>
            <Text style={styles.popupText}>
              {'Try Sample'}
            </Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={styles.clear} activeOpacity={0.5} onPress={this.handleClear}>
            <Text style={styles.clearText}>
              {'Clear All'}
            </Text>
          </TouchableOpacity>
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
  inputStyle: {
    flexDirection: 'row',
    fontSize: 16,
    borderColor: 'white',
    color: 'white',
    padding: 10,
    borderRadius: 8,
    margin: 15,
    marginBottom: 5,
    borderWidth: 1
  },
  headingStyle: {
    fontSize: 25,
    marginBottom: 5,
    alignSelf: 'center',
    color: 'white',
    justifyContent: 'center',
    alignItems: 'center'
  },
  sloganStyle: {
    fontSize: 15,
    marginBottom: 35,
    alignSelf: 'center',
    color: '#efefef',
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    alignSelf: 'center',
  },
  buttonView: {
    backgroundColor: 'rgb(0, 125, 255)',
    padding: 10,
    paddingRight: 15,
    paddingLeft: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
  optionContainerStyle: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center'
  },
  optionStyle: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 5,
    margin: 10
  },
  optionTextStyle: {
    fontSize: 14,
    color: 'rgb(0, 125, 255)'
  },
  floating: {
    position: 'absolute',
    flexDirection: 'row'
  },
  popup: {
    margin: 10,
    padding: 5,
    borderRadius: 10,
    backgroundColor: 'rgb(0, 125, 255)',
    marginTop: 45
  },
  clear: {
    margin: 10,
    padding: 5,
    borderRadius: 10,
    backgroundColor: 'white',
    marginTop: 45
  },
  popupText: {
    fontSize: 15,
    color: 'white'
  },
  clearText: {
    fontSize: 15,
    color: 'rgb(0, 125, 255)'
  },
  loading: {
    margin: 5,
  },
  error: {
    fontSize: 15,
    margin: 5,
    textAlign: 'center',
    color: 'rgb(255, 220, 50)'
  }
});

export default HomeScreen;
