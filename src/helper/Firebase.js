import firebase from "react-native-firebase";

import store from "../store/store";
import {
  recvAuthCheckResult,
  loginStateIsChanged,
  userInfoIsChanged
} from "../actions/LoginAction";
import FormatChecker from "./FormatChecker";

export default class Firebase {
  static uid() {
    return firebase.auth().currentUser.uid;
  }

  static authCheck() {
    firebase.auth().onAuthStateChanged(user => {
      console.log("Auth State Changed", user);
      if (user) {
        Firebase.getUserInfo(user.uid)
          .then(userInfo => {
            console.log("userInfo", userInfo);
            console.log("user", userInfo.val());
            if (userInfo.val()) {
              store.dispatch(userInfoIsChanged(userInfo.val()));
              store.dispatch(recvAuthCheckResult(true));
            } else {
              store.dispatch(recvAuthCheckResult(false));
            }
          })
          .catch(() => {
            store.dispatch(recvAuthCheckResult(false));
          });
      } else {
        store.dispatch(recvAuthCheckResult(false));
      }
    });
  }

  static signUp(profileImagePath, name, email, password) {
    console.log("signUp");
    return new Promise(function(resolve, reject) {
      Firebase.signUpFirebase(email, password)
        .then(response => {
          console.log(
            "sign up success",
            response,
            response.user._user.uid,
            profileImagePath
          );
          let uid = response.user._user.uid;
          let filePath = profileImagePath;

          console.log("uid", uid);
          console.log("filePath", filePath);
          return Firebase.uploadProfileImage(uid, filePath);
        })
        .then(infoForCreateUserToFirebase => {
          console.log("recv <= ", infoForCreateUserToFirebase);
          return Firebase.createUserToFirebase(
            infoForCreateUserToFirebase.uid,
            name,
            email,
            infoForCreateUserToFirebase.profileImageUri
          );
        })
        .then(uid => {
          return Firebase.getUserInfo(uid);
        })
        .then(() => {
          store.dispatch(recvAuthCheckResult(true));
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static signUpFirebase = (email, password) => {
    console.log("signUpFirebase");
    return new Promise(function(resolve, reject) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(response => {
          console.log("signUpFirebase success");
          resolve(response);
        })
        .catch(error => {
          console.log("signUpFirebase error", error.message);
          reject(error);
        });
    });
  };

  static uploadProfileImage = (uid, filePath) => {
    console.log("uploadProfileImage", uid, filePath);
    return new Promise((resolve, reject) => {
      firebase
        .storage()
        .ref("profile_images/" + uid + ".jpg")
        .putFile(filePath)
        .then(response => {
          console.log("uploadProfileImage success1", uid, response.downloadURL);

          let infoForCreateUserToFirebase = {
            uid: uid,
            profileImageUri: response.downloadURL
          };

          console.log("send => ", infoForCreateUserToFirebase);
          resolve(infoForCreateUserToFirebase);
        })
        .catch(error => {
          console.log("error", error.message);
          reject(error);
        });
    });
  };

  static createUserToFirebase = (uid, name, email, profileImageUri) => {
    console.log("createUserToFirebase", uid, name, email, profileImageUri);
    return new Promise(function(resolve, reject) {
      const ref = firebase
        .database()
        .ref("users")
        .child(uid);
      const value = {
        id: uid,
        name: name,
        email: email,
        profile_Image: profileImageUri
      };

      ref
        .set(value)
        .then(() => {
          resolve(uid);
        })
        .catch(error => {
          reject(error);
        });
    });
  };

  static login(email, password) {
    return new Promise(function(resolve, reject) {
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(userCredential => {
          return Firebase.getUserInfo(userCredential.user.uid);
        })
        .then(response => {
          store.dispatch(recvAuthCheckResult(true));
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static getUserInfo(uId) {
    console.log(uId);
    return new Promise(function(resolve, reject) {
      return firebase
        .database()
        .ref("users")
        .child(uId)
        .once("value", function(userInfo) {
          if (userInfo) {
            store.dispatch(userInfoIsChanged(userInfo.val()));
            resolve(userInfo);
          } else {
            reject();
          }
        });
    });
  }

  static getUserList() {
    return new Promise(function(resolve, reject) {
      firebase
        .database()
        .ref("users/")
        .once("value", function(snapshot) {
          console.log(snapshot.val());
          var users = [];

          snapshot.forEach(function(childSnapshot) {
            var key = childSnapshot.key;
            var childData = childSnapshot.val();

            users.push(childData);
          });

          resolve(users);
        });
    });
  }

  static sendMessage(sendValue) {
    console.log("sendMessage\n", sendValue);

    const fromId = sendValue.fromId;
    const toId = sendValue.toId;
    const chatRoomId = FormatChecker.makeChatRoomId(fromId, toId);

    return new Promise(function(resolve, reject) {
      Firebase.createMessage(chatRoomId, sendValue)
        .then(result => {
          return Firebase.checkExistChatRoom(chatRoomId, sendValue);
        })
        .then(exist => {
          if (!exist) {
            return Firebase.createChatRoomAndMessage(chatRoomId, sendValue);
          } else {
            resolve();
          }
        })
        .then(result => {
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  static checkExistChatRoom(chatRoomId, sendValue) {
    console.log(chatRoomId);

    const fromId = sendValue.fromId;
    const toId = sendValue.toId;

    return new Promise(function(resolve, reject) {
      try {
        firebase
          .database()
          .ref()
          .child("user-chat-rooms")
          .child(toId)
          .child(chatRoomId)
          .once("value", function(snapshot) {
            console.log(snapshot.val());
            if (snapshot.val()) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createMessage(chatRoomId, sendValue) {
    return new Promise(function(resolve, reject) {
      let ref = firebase.database().ref();
      let chatRoomsRef = ref.child("chat-rooms").child(chatRoomId);
      let chatRoomMessages = chatRoomsRef.child("messages");
      let chatRoomLastMessageRef = chatRoomsRef.child("lastMessage");

      let messageKey = chatRoomMessages.push(sendValue, function(snapshot) {
        console.log("chatRoomMessages", snapshot);
      }).key;

      let lastMessage = {
        ...sendValue,
        id: messageKey
      };

      try {
        chatRoomLastMessageRef.set(lastMessage, function(snapshot) {
          console.log("lastMessage", snapshot);
          console.log("done createMessage");
          resolve("createMessage");
        });
      } catch (error) {
        console.log("error", error.message);
        reject(error);
      }
    });
  }

  static createChatRoomAndMessage(chatRoomId, sendValue) {
    const fromId = sendValue.fromId;
    const toId = sendValue.toId;

    let ref = firebase.database().ref();
    let chatRoomsRef = ref.child("chat-rooms").child(chatRoomId);
    let chatUsersRef = chatRoomsRef.child("users");
    let dataForFromId = {
      users: {
        fromId: toId,
        toId: fromId
      }
    };
    let dataForSendId = {
      users: {
        fromId: fromId,
        toId: toId
      }
    };

    return new Promise(function(resolve, reject) {
      try {
        chatUsersRef.update({ fromId: fromId, toId: toId }, function(snapshot) {
          ref
            .child("user-chat-rooms")
            .child(fromId)
            .update({ [chatRoomId]: dataForFromId }, function(snapshot) {
              ref
                .child("user-chat-rooms")
                .child(toId)
                .update({ [chatRoomId]: dataForSendId }, function(snapshot) {
                  console.log("done createChatRoomAndMessage");
                  resolve("createChatRoomAndMessage");
                });
            });
        });
      } catch (error) {
        console.log("error", error.message);
        reject(error);
      }
    });
  }

  static getChatroomInfo(chatRoomId) {
    return new Promise(function(resolve, reject) {
      firebase
        .database()
        .ref()
        .child("chat-rooms")
        .child(chatRoomId)
        .once("value", function(snapshot) {
          console.log(snapshot.val());
          resolve(snapshot.val());
        });
    });
  }

  static signOut() {
    console.log("signOut");
    return new Promise(function(resolve, reject) {
      firebase
        .auth()
        .signOut()
        .then(() => {
          store.dispatch(userInfoIsChanged(false));
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
