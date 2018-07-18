import React from "react";
import {
  Dimensions,
  Image,
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Animated
} from "react-native";
import Row from "./Row";
import axios from "axios";
import Rainbow from "rainbowvis.js";

const screenWidth = Dimensions.get("window").width;

export default class App extends React.Component {
  state = {
    updateIntervalId: null,
    progressIntervalId: null,
    temp_f: null,
    icon: null,
    weather: null,
    precip_today_in: null,
    start: null,
    end: null,
    percentage: 0,
    fadeAnim: new Animated.Value(0)
  };

  rainbow = new Rainbow();

  updateTemp() {
    axios
      .get(
        "https://api.wunderground.com/api/dfeae3529e27c6b4/conditions/q/FL/Santa_Rosa_Beach.json"
      )
      .then(res => {
        let {
          temp_f,
          icon,
          weather,
          precip_today_in
        } = res.data.current_observation;
        this.setState({ temp_f, icon, weather, precip_today_in });
        // console.log(res.data.current_observation);

        Animated.timing(
          // Animate over time
          this.state.fadeAnim, // The animated value to drive
          {
            toValue: 0.4, // Animate to opacity: 1 (opaque)
            duration: 400
          }
        ).start();

        setTimeout(() => {
          Animated.timing(
            // Animate over time
            this.state.fadeAnim, // The animated value to drive
            {
              toValue: 0,
              duration: 400
            }
          ).start();
        }, 1000);
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentDidMount() {
    this.rainbow.setNumberRange(32, 90);
    this.rainbow.setSpectrum("#00a8ff", "#fbc531", "#e84118");

    this.updateTemp();
    var updateIntervalId = setInterval(() => {
      const now = +new Date();

      this.updateTemp();

      this.setState({
        start: now,
        end: now + 300000
      });
    }, 1000 * 60 * 5);

    this.setState({
      start: +new Date(),
      end: +new Date() + 300000
    });

    var progressIntervalId = setInterval(() => {
      const now = +new Date();
      const { start, end } = this.state;
      const percentage =
        100 - Math.round(((now - start) / (end - start)) * 100);
      this.setState({ percentage });
    }, 2000);

    this.setState({ updateIntervalId, progressIntervalId });
  }

  componentWillUnmount() {
    // use updateIntervalId from the state to clear the interval
    clearInterval(this.state.updateIntervalId);
    clearInterval(this.state.progressIntervalId);
  }

  render() {
    const renderStyles = StyleSheet.create({
      color: {
        color: `#${this.rainbow.colourAt(this.state.temp_f)}`
      }
    });

    if (this.state.temp_f) {
      return (
        <TouchableOpacity
          style={styles.container}
          onPress={() => this.updateTemp()}
        >
          <View style={styles.container}>
            <Animated.View
              style={[
                styles.updatedContainer,
                {
                  opacity: this.state.fadeAnim
                }
              ]}
            >
              <Text style={styles.updated}>Updated</Text>
            </Animated.View>
            <Image
              source={{
                uri: `https://cdn.rawgit.com/manifestinteractive/weather-underground-icons/f5fa0536d5412c03974d77077dde7cbbdd152048/dist/icons/white/png/256x256/${
                  this.state.icon
                }.png`
              }}
              style={styles.icon}
            />
            <Text style={[renderStyles.color, styles.condition]}>
              {this.state.weather}
            </Text>
            <Row noFlex>
              <Text style={[renderStyles.color, styles.temp]}>
                {this.state.temp_f}
              </Text>
              <Text style={[renderStyles.color, styles.degree]}>°F</Text>
            </Row>
            <Text style={styles.rain}>
              Rain: {this.state.precip_today_in} in
            </Text>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={styles.container}>
          <Text style={[styles.loading]}>Loading...</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  loading: {
    color: "white",
    fontSize: 0.05 * screenWidth
  },
  icon: {
    width: 0.25 * screenWidth,
    height: 0.2 * screenWidth
  },
  condition: {
    fontSize: 0.03 * screenWidth,
    marginTop: 0.025 * screenWidth,
    marginBottom: 0.015 * screenWidth
  },
  temp: {
    fontSize: 0.21 * screenWidth,
    marginTop: -0.04 * screenWidth,
    marginBottom: -0.04 * screenWidth
  },
  degree: {
    opacity: 0.8,
    fontSize: 0.05 * screenWidth
  },
  rain: {
    color: "gray",
    fontSize: 0.0225 * screenWidth,
    marginTop: 0.02 * screenWidth
  },
  updatedContainer: {
    position: "absolute",
    zIndex: 99,
    left: 0,
    top: 0
  },
  updated: {
    color: "white",
    fontSize: 0.02 * screenWidth
  }
});
