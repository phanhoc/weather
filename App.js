/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  Platform, 
  StyleSheet, 
  Text, 
  View, 
  ImageBackground, 
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';

import SearchInput from'./components/SearchInput'
import getImageForWeather from './utils/getImageForWeather'
import {fetchLocationId, fetchWeather} from './utils/api'

export default class App extends React.Component {
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

  componentDidMount(){
    this.setState({weather:'Clear'});
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
        console.log(this.state);
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
            <ActivityIndicator animating={loading} color="white" size="large"/>
            {!loading && (
              <View>
                {error && (
                  <Text style={[styles.smallText, styles.textStyle]}>
                    Could not load weather, please try a different city.
                  </Text>
                )}

                {!error && (
                  <View>
                    <Text style={[styles.largeText, styles.textStyle]}>{location}</Text>
                    <Text style={[styles.smallText, styles.textStyle]}>{weather}</Text>
                    <Text style={[styles.largeText, styles.textStyle]}>{`${Math.round(temperature)}°`}</Text>
                  </View>
                )}
              </View>
            )}

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
  container: {
    flex: 1,
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
  },

  smallText: {
    fontSize: 18,
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
