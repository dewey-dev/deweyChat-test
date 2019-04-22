import React, { Component } from "react";
import { Dimensions } from "react-native";
import { createStackNavigator } from "react-navigation";
import { connect } from "react-redux";

import { loginStateIsChanged } from "../actions/LoginAction";
import Icon from "react-native-vector-icons/Feather";
import Firebase from "../helper/Firebase";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView
} from "react-native";

const EMAIL = "EMAIL";
const PASSWORD = "PASSWORD";

class Login extends Component {
  state = {
    email: "",
    password: ""
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "로그인",
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack(null)}>
          <Icon name="x" size={24} />
        </TouchableOpacity>
      )
    };
  };

  didChangedTextInput = (text, senderId) => {
    const state = this.state;

    switch (senderId) {
      case EMAIL:
        this.setState({
          ...state,
          email: text
        });
        break;
      case PASSWORD:
        this.setState({
          ...state,
          password: text
        });
        break;
    }
  };

  requestLogin = () => {
    const { email, password } = this.state;

    Firebase.login(email, password)
      .then({})
      .catch(error => {
        alert(error.message);
      });
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <View style={styles.inputViewContainer}>
          <TextInput
            style={styles.emailInputText}
            placeholder="이메일"
            onChangeText={text => this.didChangedTextInput(text, EMAIL)}
          />
          <TextInput
            style={styles.passwordTextInput}
            placeholder="비밀번호"
            secureTextEntry={true}
            onChangeText={text => this.didChangedTextInput(text, PASSWORD)}
          />
          <TouchableOpacity onPress={this.requestLogin}>
            <View style={styles.loginButton}>
              <Text style={styles.loginButtonText}>로그인</Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loginStateIsChanged: isLogin => dispatch(loginStateIsChanged(isLogin))
});

export default (LoginNavigator = createStackNavigator({
  LoginScreen: {
    screen: connect(
      null,
      mapDispatchToProps
    )(Login)
  }
}));

var { height, width } = Dimensions.get("window");
var inputViewWidth = width - 50;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "white"
  },
  inputViewContainer: {
    width: inputViewWidth,
    marginTop: 80
  },
  emailInputText: {
    height: 40,
    marginBottom: 20,
    backgroundColor: "white",
    borderBottomColor: "gray",
    borderBottomWidth: 0.5
  },
  passwordTextInput: {
    height: 40,
    marginBottom: 20,
    backgroundColor: "white",
    borderBottomColor: "gray",
    borderBottomWidth: 0.5
  },
  loginButton: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#13c0bb"
  },
  loginButtonText: {
    textAlign: "center",
    color: "white",
    backgroundColor: "transparent"
  }
});
