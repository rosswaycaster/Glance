import React from "react";
import { Dimensions, Image, StyleSheet, TouchableOpacity } from "react-native";

const screenWidth = Dimensions.get("window").width;

class Radar extends React.Component {
  state = {
    intervalId: null,
    uri:
      "https://api.wunderground.com/api/dfeae3529e27c6b4/animatedradar/q/FL/Santa_Rosa_Beach.gif?newmaps=1&timelabel=1&timelabel.y=10&num=10&delay=100&tzname=America/Chicago"
  };

  updateRadar() {
    this.setState({
      uri: `https://api.wunderground.com/api/dfeae3529e27c6b4/animatedradar/q/FL/Santa_Rosa_Beach.gif?newmaps=1&timelabel=1&timelabel.y=10&num=10&delay=100&tzname=America/Chicago&${new Date().getTime()}`
    });
  }

  componentDidMount() {
    var intervalId = setInterval(() => {
      this.updateRadar();
    }, 1000 * 60 * 7);
    // store intervalId in the state so it can be accessed later:
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }

  render() {
    return (
      <TouchableOpacity
        onPress={() => this.updateRadar()}
        style={styles.container}
      >
        <Image
          style={styles.image}
          onError={() => this.updateRadar}
          source={{
            uri: this.state.uri
          }}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    width: 0.47 * screenWidth,
    height: 0.47 * screenWidth
  }
});

export default Radar;
