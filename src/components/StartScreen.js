import React from "react";
import { Text, View, ActivityIndicator } from "react-native";

class StartScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#13c0bb" />
        <Text>로 딩 중</Text>
      </View>
    );
  }
}

export default StartScreen;
