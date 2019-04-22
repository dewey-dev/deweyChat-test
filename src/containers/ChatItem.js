import React from "react";
import { StyleSheet, Image, View, Text } from "react-native";
import Firebase from "../helper/Firebase";
import DYImage from "../helper/DYImage";

export default class ChatItem extends React.Component {
  render() {
    const { message, timestamp, toId, fromId } = this.props.message;
    const user = this.props.user;

    return (
      <View style={styles.container}>
        {fromId === Firebase.uid() ? (
          <View style={styles.sendContainer}>
            <View style={styles.sendTextContainer}>
              <Text style={styles.sendText}>{message}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.recvContainer}>
            <DYImage
              style={styles.recvProfileImage}
              source={user.profile_Image}
            />
            <View style={styles.recvTextContainer}>
              <Text style={styles.recvText}>{message}</Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5
  },
  sendContainer: {
    flex: 1,
    alignItems: "flex-end",
    marginRight: 5
  },
  recvContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    alignItems: "center",
    marginLeft: 5
  },
  recvProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 3,
    marginTop: 3,
    backgroundColor: "red"
  },
  sendTextContainer: {
    backgroundColor: "#13c0bb",
    borderRadius: 1
  },
  recvTextContainer: {
    backgroundColor: "#858585",
    borderRadius: 1,
    marginLeft: 5
  },
  sendText: {
    textAlign: "right",

    color: "white",
    marginTop: 3,
    marginLeft: 3,
    marginBottom: 3,
    marginRight: 3
  },
  recvText: {
    textAlign: "left",
    color: "white",
    marginTop: 3,
    marginLeft: 3,
    marginBottom: 3,
    marginRight: 3
  }
});
