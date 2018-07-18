import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import moment from "moment";

const screenWidth = Dimensions.get("window").width;

export default class DateTime extends React.Component {
  state = { intervalId: null, time: null, date: null };

  updateTime() {
    let time = moment().format("h:mm:ss");
    let date = moment().format("MMM D");
    let day = moment().format("ddd");

    this.setState({ time, date, day });
  }

  componentDidMount() {
    this.updateTime();
    var intervalId = setInterval(() => {
      this.updateTime();
    }, 100);
    // store intervalId in the state so it can be accessed later:
    this.setState({ intervalId: intervalId });
  }

  componentWillUnmount() {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.time}>{this.state.time}</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{this.state.date}</Text>
          <Text style={styles.date}>{this.state.day}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "stretch",
    marginTop: -10,
    paddingLeft: 20,
    paddingRight: 20
  },
  time: {
    color: "white",
    fontSize: 0.2 * screenWidth
  },
  dateContainer: {
    alignItems: "center",
    justifyContent: "center"
  },
  date: {
    color: "white",
    fontSize: 0.08 * screenWidth
  }
});
