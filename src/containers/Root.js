import React from "react";
import { connect } from "react-redux";
import { View } from "react-native";

import Firebase from "../helper/Firebase";
import StartScreen from "../components/StartScreen";
import Welcome from "../containers/Welcome";
import Main from "../containers/Main";

class Root extends React.Component {
  componentWillMount() {
    Firebase.authCheck();
  }

  render() {
    const { showStartScreen, isLogin } = this.props;

    console.log(this.props);
    return (
      <View style={{ flex: 1 }}>
        {showStartScreen ? <StartScreen /> : isLogin ? <Main /> : <Welcome />}
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { showStartScreen, isLogin } = state;
  return {
    showStartScreen,
    isLogin
  };
}

export default connect(
  mapStateToProps,
  null
)(Root);
