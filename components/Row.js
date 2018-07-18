import React from "react";
import { StyleSheet, View } from "react-native";

export default (Row = props => {
  const styles = StyleSheet.create({
    row: {
      flex: props.noFlex ? 0 : 1,
      flexDirection: "row"
    }
  });

  return (
    <View props style={[styles.row, props.style]}>
      {props.children}
    </View>
  );
});
