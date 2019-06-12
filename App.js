/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ImageBackground} from 'react-native';

import SearchInput from'./components/SearchInput'
import getImageForWeather from './utils/getImageForWeather'
import {fetchLocationId, fetchWeather} from './utils/api'

export default class App extends Component<Props> {
  constructor(props){
    super(props)
    this.state={
      loading: false,
      error: false,
      location:'',
      temperature:0,
      weather:'',
    }
  }

  handleUpdateLocation = async city => {
    if (!city) return;

    this.setState({loading: true}, async () => {
      try {
        const locationId = await fetchLocationId(city);
        const {location, weather, temperature} = await fetchWeather(locationId);

        this.setState({
          loading: false,
          error: false,
          location, 
          weather,
          temperature,
        });
      } catch (e) {
        this.setState({
          loading: false,
          error: true,
        });
      }
    });
  };

  render() {
    const { loading, error, location, weather, temperature } = this.state;

    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <ImageBackground
          source={getImageForWeather(weather)}
          style={styles.imageBackground}
          imageStyle={styles.image}
        >

          <View style={styles.detailsContainer}>
            <Text style={[styles.largeText, styles.textStyle]}>{location}</Text>
            <Text style={[styles.smallText, styles.textStyle]}>{weather}</Text>
            <Text style={[styles.largeText, styles.textStyle]}>{`${Math.round(temperature)}°`}</Text>

            <SearchInput 
              placeholder="Search any city" 
              onSubmit={this.handleUpdateLocation}
            />
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
  },

  smallText: {
    fontSize: 18,
  },
  textInput: {
    backgroundColor: '#666',
    color: 'white',
    height: 40,
    width: 300,
    marginTop: 20,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  imageBackground: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  detailsContainer:{
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  },
});
