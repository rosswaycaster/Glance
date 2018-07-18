import React from "react";
import { SafeAreaView, StatusBar, StyleSheet, View } from "react-native";
import Row from "./components/Row";
import DateTime from "./components/DateTime";
import Weather from "./components/Weather";
import Radar from "./components/Radar";
import Todo from "./components/Todo";

export default class App extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <StatusBar hidden barStyle="light-content" />
          <DateTime />
          <Row>
            <Weather />
            <Radar />
          </Row>
          <Todo />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "black"
  },
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "flex-start"
  }
});
