import React from "react";
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import { createStackNavigator } from "react-navigation";
import Icon from "react-native-vector-icons/Feather";

import UserListItem from "./UserListItem";
import ChatRoom from "./ChatRoom";
import Firebase from "../helper/Firebase";
import FormatChecker from "../helper/FormatChecker";

class UserList extends React.Component {
  state = {
    users: []
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "사용자 목록",
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            console.log(navigation);
            navigation.goBack();
          }}
        >
          <Icon name="chevron-left" size={24} />
        </TouchableOpacity>
      )
    };
  };

  componentDidMount() {
    console.log("ComponentDidMount");
    Firebase.getUserList().then(users => {
      console.log("=-=-=-= recv =-=-=-=");
      console.log(users);

      const oldState = this.state;
      this.setState({
        ...oldState,
        users: users
      });
    });
  }

  _renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        this._onPressAction(item, index);
      }}
    >
      <UserListItem user={item} />
    </TouchableOpacity>
  );

  _onPressAction = (item, index) => {
    let userId = item.id;

    this.props.navigation.navigate("chatRoom", { toUserId: userId });
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.userList}
          data={this.state.users}
          keyExtractor={item => item.email}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}

export default UserList;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  userList: {
    flex: 1
  }
});
