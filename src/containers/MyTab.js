import React from "react";
import { Text, View, Button } from "react-native";
import { createStackNavigator } from "react-navigation";

import Firebase from "../helper/Firebase";

class MyTab extends React.Component {
  logOut = () => {
    console.log("logout func");
    Firebase.signOut().catch(error => {
      alert(error.message);
    });
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>MyTab</Text>
        <Button title="logout" onPress={this.logOut} />
      </View>
    );
  }
}

export default (myTabNavigator = createStackNavigator({
  my: MyTab
}));
