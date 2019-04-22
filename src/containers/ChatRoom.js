import React from "react";
import { connect } from "react-redux";
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  TextInput,
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Firebase from "../helper/Firebase";
import Icon from "react-native-vector-icons/Feather";
import firebase from "react-native-firebase";
import FormatChecker from "../helper/FormatChecker";
import ChatItem from "./ChatItem";

class ChatRoom extends React.Component {
  constructor(props) {
    super(props);

    let toUserId = this.props.navigation.getParam("toUserId");
    let chatRoomId = FormatChecker.makeChatRoomId(toUserId, Firebase.uid());

    this.messagesRef = firebase
      .database()
      .ref()
      .child("chat-rooms")
      .child(chatRoomId)
      .child("messages");

    // Initial State
    this.state = {
      partner: null,
      messages: [],
      inputText: "",
      inputTextHeight: 0,
      keyboardHeight: 0,
      chatRooms: null,
      reservationActionId: ""
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: navigation.state.params.title,
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

  componentWillUnmount() {
    this.messagesRef.off();
  }

  componentDidMount() {
    console.log("=====>mount");
    let toUserId = this.props.navigation.getParam("toUserId");
    let chatRoomId = FormatChecker.makeChatRoomId(toUserId, Firebase.uid());

    let thisRef = this;

    Firebase.getUserInfo(toUserId)
      .then(userInfo => {
        thisRef._setPartnerInfo(userInfo);
        thisRef._getMessages(chatRoomId);
      })
      .catch({});
  }

  _setPartnerInfo(info) {
    console.log("partner", info);
    const oldState = this.state;
    this.setState({
      ...oldState,
      partner: info.val()
    });

    const oldParams = this.props.navigation;
    this.props.navigation.setParams({
      ...oldParams,
      title: info.val().name
    });
  }

  _getMessages(chatRoomId) {
    console.log("_getMessages", chatRoomId);
    let thisRef = this;
    this.messagesRef.on("child_added", function(snapshot) {
      let message = snapshot;
      thisRef._updateMessage(message);
    });
  }

  _updateMessage = message => {
    var messages = this.state.messages;
    messages.push(message);

    const oldState = this.state;

    this.setState({
      ...oldState,
      messages: messages
    });

    this._scrollToEnd();
    console.log("messages", this.state.messages);
  };

  _scrollToEnd() {
    const oldState = this.state;
    clearTimeout(oldState.reservationActionId);
    let timerId = setTimeout(() => this.refs.flatList.scrollToEnd(true), 500);
    this.setState({
      ...oldState,
      reservationActionId: timerId
    });
  }

  keyboardWillShow(e) {
    let keyboardHeight = e.endCoordinates.height;
    const oldState = this.state;

    this.setState({
      ...oldState,
      keyboardHeight: keyboardHeight
    });
  }

  keyboardWillHide(e) {
    const oldState = this.state;
    this.setState({
      ...oldState,
      keyboardHeight: 0
    });
  }

  _textDidChanged = text => {
    const oldState = this.state;
    this.setState({
      ...oldState,
      inputText: text
    });
  };

  _inputTextSizeChanged = event => {
    const oldState = this.state;
    this.setState({
      ...oldState,
      inputTextHeight: event.nativeEvent.contentSize.height
    });
  };

  _sendMessage = () => {
    let message = this.state.inputText;
    let trimedMessage = message.trim();

    if (trimedMessage.length > 0) {
      const partner = this.state.partner;

      let toId = partner.id;
      let fromId = Firebase.uid();
      let timestamp = Math.floor(Date.now());
      let message = trimedMessage;

      let sendValue = {
        toId: toId,
        fromId: fromId,
        timestamp: timestamp,
        message: message
      };

      Firebase.sendMessage(sendValue)
        .then(() => {
          const oldState = this.setState;
          this.setState({
            ...oldState,
            inputText: ""
          });
        })
        .catch({});
    }
  };

  _navigationBarHeight() {
    return 88;
  }

  _renderItem = ({ item, index }) => {
    let message = item.val();
    let user = this.state.partner;
    return <ChatItem message={message} user={user} />;
  };

  render() {
    const { partner } = this.state;

    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            style={styles.keyboardAvoid}
            keyboardVerticalOffset={this._navigationBarHeight()}
            behavior="padding"
            enabled
          >
            {partner ? (
              <View style={{ flex: 1 }}>
                <FlatList
                  extraData={this.state}
                  style={styles.messageList}
                  data={this.state.messages}
                  keyExtractor={item => item.key}
                  renderItem={this._renderItem}
                  ref="flatList"
                />
                <View
                  style={[
                    styles.inputMessageContainer,
                    {
                      height: Math.min(
                        100,
                        Math.max(40, this.state.inputTextHeight + 6)
                      )
                    }
                  ]}
                >
                  <TextInput
                    placeholder="Message"
                    style={styles.textInput}
                    onChangeText={this._textDidChanged}
                    onContentSizeChange={this._inputTextSizeChanged}
                    multiline={true}
                    value={this.state.inputText}
                  />
                  <TouchableOpacity
                    onPress={this._sendMessage}
                    style={styles.sendButtonOpacity}
                  >
                    <View style={styles.sendButtonContainer}>
                      <Text style={styles.sendButtonText}>{"Send"}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View />
            )}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </View>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}

export default connect(
  mapStateToProps,
  null
)(ChatRoom);

var { height, width } = Dimensions.get("window");
var sendButtonWidth = 80;
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  safeArea: {
    flex: 1
  },
  keyboardAvoid: {
    flex: 1
  },
  messageList: {
    flex: 1
  },
  inputMessageContainer: {
    borderTopWidth: 0.2,
    borderColor: "#333333",
    flexDirection: "row"
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    marginTop: 3,
    marginBottom: 3
  },
  sendButtonOpacity: {
    flex: 1,
    width: sendButtonWidth
  },
  sendButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#13c0bb",
    marginLeft: 5,
    marginRight: 5,
    marginTop: 3,
    marginBottom: 3,
    borderRadius: 2
  },
  sendButtonText: {
    color: "black"
  }
});
