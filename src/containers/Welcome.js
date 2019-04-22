import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text, Image } from "react-native";
import { createStackNavigator, createAppContainer } from "react-navigation";

import Login from "../containers/Login";
import SignUp from "../containers/SignUp";

class Welcome extends React.Component {
  static navigationOptions = {
    title: "Welcome",
    header: null
  };

  loginButtonAction = () => {
    this.props.navigation.navigate("Login");
  };

  signUpButtonAction = () => {
    this.props.navigation.navigate("SignUp");
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.top}>
          <Image style={styles.logoImage} source={require("../../resource/logo.png")}></Image>
        </View>
        <View style={styles.bottom}>
          <TouchableOpacity onPress={this.loginButtonAction} activeOpacity={0.9}>
            <View style={styles.Button}>
              <Text style={styles.ButtonText}>로그인</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.signUpButtonAction} activeOpacity={0.9}>
            <View style={styles.Button}>
              <Text style={styles.ButtonText}>가입하기</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const navigator = createStackNavigator({
  root: Welcome
});

const WelcomeNavigator = createStackNavigator(
  {
    root: { screen: navigator },
    Login: { screen: Login },
    SignUp: { screen: SignUp }
  },
  {
    mode: "modal", // Remember to set the root navigator to display modally.
    headerMode: "none" // This ensures we don't get two top bars.
  }
);

export default createAppContainer(WelcomeNavigator);

const styles = StyleSheet.create({
  container: {
    flex: 2,
    flexDirection: "column",
    backgroundColor: "#13c0bb"
  },
  top: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center"
  },
  logoImage: {
    width: 800,
    height: 800,
  },
  bottom: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center"
  },
  Button: {
    width: 200,
    height: 50,
    marginBottom: 20,
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    opacity: 0.95,
  },
  ButtonText: {
    textAlign: "center",
    fontSize: 14,
    color: "#13c0bb",
    backgroundColor: "transparent",
    opacity: 0.95,
  }
});
