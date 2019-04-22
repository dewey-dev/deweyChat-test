import React from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import firebase from "react-native-firebase";
import Firebase from "../helper/Firebase";
import FormatChecker from "../helper/FormatChecker";
import DYImage from "../helper/DYImage";

export default class ChatRoomItem extends React.Component {
  constructor(props) {
    super(props);

    const { chatRoomInfo } = this.props;
    console.log("chatRoomInfo", chatRoomInfo);

    let toId = chatRoomInfo.users.toId;
    let fromId = chatRoomInfo.users.fromId;
    let myId = Firebase.uid();

    let targetId = toId === myId ? fromId : toId;
    console.log("targetId", targetId);

    this.getUserInfoRef = firebase
      .database()
      .ref("users")
      .child(targetId);

    this.state = {
      showInfo: null
    };
  }

  componentWillUnmount() {
    this.getUserInfoRef.off();
  }

  componentDidMount() {
    let thisRef = this;
    this.getUserInfoRef.on("value", function(snapshot) {
      if (snapshot) {
        thisRef._showUserInfo(snapshot);
      }
    });
  }

  _showUserInfo(userInfo) {
    if (userInfo) {
      const { chatRoomInfo } = this.props;

      let timestamp = chatRoomInfo.lastMessage["timestamp"];
      console.log("timestamp", timestamp);

      let dateString = FormatChecker.makeDateString(timestamp);
      console.log("dateString", dateString);

      let showInfo = {
        profileImage: userInfo.val().profile_Image,
        name: userInfo.val().name,
        lastMessage: chatRoomInfo.lastMessage["message"],
        time: dateString
      };

      console.log("result", showInfo);

      this.setState({
        showInfo: showInfo
      });
    }
  }

  render() {
    const { showInfo } = this.state;
    const { chatRoomInfo } = this.props;

    return (
      <View style={styles.container}>
        {showInfo ? (
          <View style={styles.container}>
            <View style={styles.content}>
              <DYImage
                style={styles.profileImage}
                source={showInfo.profileImage}
              />
              <View style={styles.infoContainer}>
                <Text numberOfLines={1} style={styles.nameLabel}>
                  {showInfo.name}
                </Text>
                <Text numberOfLines={1} style={styles.messageLabel}>
                  {showInfo.lastMessage}
                </Text>
              </View>
              <Text style={styles.timestampLabel}>{showInfo.time}</Text>
            </View>
          </View>
        ) : (
          <View />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 80
  },
  emptyContent: {
    flex: 1,
    backgroundColor: "yellow"
  },
  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center"
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
    marginRight: 10
  },
  infoContainer: {
    flex: 1
  },
  nameLabel: {
    fontSize: 20
  },
  messageLabel: {
    marginTop: 5,
    fontSize: 13,
    color: "gray"
  },
  timestampLabel: {
    fontSize: 12,
    marginRight: 10
  }
});
