import React from "react";
import {
  View,
  CameraRoll,
  Alert,
  Image,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { createStackNavigator } from "react-navigation";

export default class PhotoSelect extends React.Component {
  state = {
    photos: []
  };

  componentDidMount() {
    CameraRoll.getPhotos({
      first: 20,
      groupTypes: "All",
      assetType: "Photos"
    })
      .then(r => {
        console.log(r);
        this.setState({ photos: r.edges });
      })
      .catch(err => {
        Alert.alert("", "이미지 불러오기 실패", [
          {
            text: "OK",
            onPress: () => this.props.navigation.goBack(null)
          }
        ]);
      });
  }

  photoSelected = index => {
    this.props.navigation.goBack(null);
    var delegate = this.props.navigation.getParam("selectAction");
    var image = this.state.photos[index].node.image.uri;
    delegate(image);
  };

  render() {
    const { photos } = this.state;
    return (
      <View>
        {!photos ? (
          <View />
        ) : (
          <ScrollView>
            {this.state.photos.map((p, i) => {
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    this.photoSelected(i);
                  }}
                >
                  <Image
                    style={{
                      width: 100,
                      height: 100
                    }}
                    source={{ uri: p.node.image.uri }}
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    );
  }
}
