import React, { Component } from "react";
import { Dimensions } from "react-native";
import { createStackNavigator } from "react-navigation";
import { connect } from "react-redux";

import { loginStateIsChanged } from "../actions/LoginAction";
import Firebase from "../helper/Firebase";
import FormatChecker from "../helper/FormatChecker";
import Icon from "react-native-vector-icons/Feather";
import ImagePicker from "react-native-image-picker";

import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const NICK_NAME = "NICK_NAME";
const EMAIL = "EMAIL";
const PASSWORD = "PASSWORD";
const CONFIRM_PASSWORD = "CONFIRM_PASSWORD";

class SignUp extends React.Component {
  state = {
    errorMessage: "",
    profileImagePath: null,
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "가입",
      headerLeft: (
        <TouchableOpacity>
          <Icon name="x" size={24} onPress={() => navigation.goBack(null)} />
        </TouchableOpacity>
      )
    };
  };

  didChangedTextInput = (text, senderId) => {
    switch (senderId) {
      case NICK_NAME:
        this.setState({
          ...this.state,
          name: text
        });
        break;
      case EMAIL:
        this.setState({
          ...this.state,
          email: text
        });
        break;
      case PASSWORD:
        this.setState({
          ...this.state,
          password: text
        });
        break;
      case CONFIRM_PASSWORD:
        this.setState({
          ...this.state,
          confirmPassword: text
        });
        break;
      default:
        break;
    }
  };

  endEditingTextInput = senderId => {
    var result = null;

    switch (senderId) {
      case NICK_NAME:
        result = FormatChecker.validateNickName(this.state.name);
        break;
      case EMAIL:
        result = FormatChecker.validateEmail(this.state.email);
        break;
      case PASSWORD:
        break;
      case CONFIRM_PASSWORD:
        result = FormatChecker.validatePassword(
          this.state.password,
          this.state.confirmPassword
        );
        break;
      default:
        break;
    }

    if (result && result.message.length > 0) {
      this.setState({
        ...this.state,
        errorMessage: result.message
      });
    }
  };

  profileImageButtonPressed = () => {
    console.log("pressed");
    const options = {
      title: "프로필 이미지 선택",
      // customButtons: [{ name: "fb", title: "Choose Photo from Facebook" }],
      storageOptions: {
        skipBackup: true,
        path: "images"
      }
    };

    ImagePicker.showImagePicker(options, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const source = response.uri;
        const oldState = this.state;
        console.log(source);
        this.setState({
          ...oldState,
          profileImagePath: source
        });
      }
    });
  };

  requestSignUp = () => {
    if (!this.state.profileImagePath) {
      const oldState = this.state;
      this.setState({
        ...oldState,
        errorMessage: "프로필 이미지가 필요해요"
      });
      return false;
    }
    if (
      FormatChecker.signUpEnableCheck(
        this.state.profileImagePath,
        this.state.name,
        this.state.email,
        this.state.password,
        this.state.confirmPassword
      )
    ) {
      Firebase.signUp(
        this.state.profileImagePath,
        this.state.name,
        this.state.email,
        this.state.password
      )
        .then(() => {
          console.log("sign up success");
          console.log(this.props);
          this.props.loginStateIsChanged(true);
        })
        .catch(error => {
          const oldState = this.state;
          this.setState({
            ...oldState,
            errorMessage: error.message
          });
          console.log("show alert at sign up");
          alert(error.message);
        });
    }
  };

  render() {
    return (
      <ScrollView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          enabled
        >
          <View style={styles.inputViewContainer}>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <TouchableOpacity onPress={this.profileImageButtonPressed}>
                <Image
                  style={styles.profileImageView}
                  source={
                    this.state.profileImagePath !== null
                      ? { uri: this.state.profileImagePath }
                      : require("../../resource/profileImage_empty.jpg")
                  }
                />
              </TouchableOpacity>
            </View>
            <View style={styles.inputErrorMessageView}>
              <Text style={styles.inputErrorText}>
                {this.state.errorMessage}
              </Text>
            </View>
            <TextInput
              style={styles.inputText}
              placeholder="닉네임"
              onChangeText={text => this.didChangedTextInput(text, NICK_NAME)}
              onEndEditing={text => this.endEditingTextInput(NICK_NAME)}
            />
            <TextInput
              style={styles.inputText}
              placeholder="이메일"
              onChangeText={text => this.didChangedTextInput(text, EMAIL)}
              onEndEditing={text => this.endEditingTextInput(EMAIL)}
            />
            <TextInput
              style={styles.inputText}
              placeholder="비밀번호"
              secureTextEntry={true}
              onChangeText={text => this.didChangedTextInput(text, PASSWORD)}
              onEndEditing={text => this.endEditingTextInput(PASSWORD)}
            />
            <TextInput
              style={styles.inputText}
              placeholder="비밀번호 확인"
              secureTextEntry={true}
              onChangeText={text =>
                this.didChangedTextInput(text, CONFIRM_PASSWORD)
              }
              onEndEditing={text => this.endEditingTextInput(CONFIRM_PASSWORD)}
            />
            <TouchableOpacity onPress={this.requestSignUp}>
              <View style={styles.signUpButton}>
                <Text style={styles.signUpButtonText}>가입하기</Text>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  loginStateIsChanged: isLogin => dispatch(loginStateIsChanged(isLogin))
});

export default (SignUpNavigator = createStackNavigator({
  SignUpScreen: {
    screen: connect(
      null,
      mapDispatchToProps
    )(SignUp)
  }
}));

var { height, width } = Dimensions.get("window");
var inputViewWidth = width - 50;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "white",
    marginBottom: 50
  },
  profileImageView: {
    width: 90,
    height: 90,
    resizeMode: "cover",
    borderRadius: 7
  },
  profileImageButton: {
    width: 90,
    height: 90,
    backgroundColor: "red"
  },
  inputViewContainer: {
    width: inputViewWidth,
    marginTop: 50,
    marginBottom: 80
  },
  inputErrorMessageView: {
    height: 40,
    justifyContent: "center",
    alignItems: "center"
  },
  inputErrorText: {
    textAlign: "center",
    fontSize: 12,
    color: "red",
    backgroundColor: "transparent"
  },
  inputText: {
    height: 40,
    marginBottom: 20,
    backgroundColor: "white",
    borderBottomColor: "gray",
    borderBottomWidth: 0.5
  },
  signUpButton: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#13c0bb"
  },
  signUpButtonText: {
    textAlign: "center",
    fontSize: 14,
    color: "white",
    backgroundColor: "transparent"
  }
});
