import React from "react";
import { connect } from "react-redux";
import { StyleSheet, View, TouchableOpacity, FlatList } from "react-native";
import { createStackNavigator } from "react-navigation";
import Icon from "react-native-vector-icons/Feather";
import firebase from "react-native-firebase";
import UserList from "./UserList";
import ChatRoomItem from "./ChatRoomItem";
import FormatChecker from "../helper/FormatChecker";
import ChatRoom from "./ChatRoom";
import Firebase from "../helper/Firebase";

class ChatRoomListTab extends React.PureComponent {
  constructor(props) {
    super(props);

    let user = this.props.user;
    this.chatRoomListRef = firebase
      .database()
      .ref()
      .child("user-chat-rooms")
      .child(user.id);

    this.state = {
      chatRoomsDic: [],
      chatRooms: [],
      chatRoomChangeListener: null
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: "채팅 리스트",
      headerRight: (
        <TouchableOpacity>
          <Icon
            name="plus"
            size={24}
            onPress={() =>
              navigation.navigate("userList", {
                mode: "modal", // Remember to set the root navigator to display modally.
                headerMode: "none" // This ensures we don't get two top bars.
              })
            }
          />
        </TouchableOpacity>
      )
    };
  };

  componentDidMount() {
    this._getChatList();
    this._observeChangeLastMessage();
  }

  componentWillUnmount() {
    if (this.chatRoomListRef) {
      this.chatRoomListRef.off();
    }
    if (this.state.chatRoomChangeListener) {
      this.state.chatRoomChangeListener.off();
    }
  }

  _getChatList() {
    console.log("_getChatList");
    let user = this.props.user;
    const thisRef = this;

    console.log("user", user);

    if (this.chatRoomListRef) {
      this.chatRoomListRef.off();
    }

    this.chatRoomListRef.on("child_added", function(snapshot) {
      thisRef._getChatRoomInfo(snapshot);
    });
  }

  _getChatRoomInfo = addedChatRoomInfo => {
    console.log("_getChatRoomInfo", addedChatRoomInfo);

    let chatRoomId = addedChatRoomInfo.key;
    let users = addedChatRoomInfo.val();

    thisRef = this;
    let chatRoomInfoRef = firebase
      .database()
      .ref()
      .child("chat-rooms")
      .child(chatRoomId);

    chatRoomInfoRef.once("value", function(snapshot) {
      console.log("from _getChatRoomInfo", users.users);
      thisRef._updatedNewMessage(snapshot, users.users);
    });
  };

  _observeChangeLastMessage() {
    thisRef = this;
    const oldState = this.state;

    if (oldState.chatRoomChangeListener) {
      oldState.chatRoomChangeListener.off();
    }

    let chatRoomInfoRef = firebase
      .database()
      .ref()
      .child("chat-rooms");

    this.setState({
      ...oldState,
      chatRoomChangeListener: chatRoomInfoRef
    });

    chatRoomInfoRef.on("child_changed", function(snapshot) {
      let chatRoomId = snapshot.key;
      let data = snapshot.val();

      console.log("fromObserver", data);
      thisRef._updatedNewMessage(snapshot, data.users);
    });
  }

  _updatedNewMessage = (response, users) => {
    console.log("_updatedNewMessage");
    console.log("response", response);
    console.log("users", users);

    // get old
    const oldState = this.state;
    let newChatRoomsDic = this.state.chatRoomsDic;

    let chatRoomId = response.key;
    let chatRoomInfo = response.val();

    let updateData = {
      id: chatRoomId,
      lastMessage: chatRoomInfo.lastMessage,
      users: users ? users : chatRoomInfo.users
    };

    if (
      updateData.id === undefined ||
      updateData.lastMessage === undefined ||
      updateData.users === undefined
    ) {
      return;
    }

    console.log("updateData", updateData);
    newChatRoomsDic[chatRoomId] = updateData;

    var newChatRooms = [];

    for (var key in newChatRoomsDic) {
      newChatRooms.push(newChatRoomsDic[key]);
    }

    newChatRooms.sort(function(a, b) {
      console.log("a", a.lastMessage);
      console.log("b", b.lastMessage);
      return a.lastMessage.timestamp > b.lastMessage.timestamp ? -1 : 1;
    });

    this.setState({
      ...oldState,
      chatRooms: []
    });
    this.setState({
      ...oldState,
      chatRoomsDic: newChatRoomsDic,
      chatRooms: newChatRooms
    });

    console.log("state updated", newChatRooms);
  };

  _renderItem = ({ item, index }) => (
    <TouchableOpacity
      onPress={() => {
        this._onPressAction(item, index);
      }}
    >
      <ChatRoomItem chatRoomInfo={item} />
    </TouchableOpacity>
  );

  _onPressAction = (item, index) => {
    let users = item.users;
    let toId = users["toId"];
    let fromId = users["fromId"];
    let chatRoomId = FormatChecker.makeChatRoomId(toId, fromId);
    let roUserId = toId == Firebase.uid() ? fromId : toId;

    this.props.navigation.navigate("chatRoom", {
      toUserId: roUserId
    });
  };

  render() {
    const { chatRooms } = this.state;
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.chatRooms}
          keyExtractor={item => item.id}
          renderItem={this._renderItem}
          extraData={this.state}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  chatRoomList: {
    flex: 1,
    backgroundColor: "red"
  }
});

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}

const ChatRoomListTabNavigator = createStackNavigator(
  {
    root: {
      screen: connect(
        mapStateToProps,
        null
      )(ChatRoomListTab)
    },
    chatRoom: { screen: ChatRoom },
    userList: { screen: UserList }
  },
  {
    // mode: "modal", // Remember to set the root navigator to display modally.
    // headerMode: "none" // This ensures we don't get two top bars.
  }
);

ChatRoomListTabNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }

  return {
    tabBarVisible
  };
};

export default ChatRoomListTabNavigator;
