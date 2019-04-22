import React from "react";
import { StyleSheet, View, Text } from "react-native";
import DYImage from "../helper/DYImage";

export default class UserListItem extends React.Component {
  render() {
    const { user } = this.props;
    console.log("recv <=", user);
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <DYImage style={styles.profileImage} source={user.profile_Image} />
          <View style={styles.infoContainer}>
            <Text style={styles.nameLabel}>{user.name}</Text>
            <Text style={styles.emailLabel}>{user.email}</Text>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 70
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
  infoContainer: {},
  nameLabel: {
    fontSize: 20
  },
  emailLabel: {
    fontSize: 13
  }
});
