import React from "react";
import { View } from "react-native";
import { CachedImage } from "react-native-cached-image";

export default class DYImage extends React.Component {
  render() {
    const { style, source, inputPlaceholder } = this.props;

    return (
      <View style={[style, { overflow: "hidden" }]}>
        <CachedImage
          style={{ flex: 1 }}
          defaultSource={require("../../resource/profileImage_empty.jpg")}
          source={{
            uri: source
          }}
        />
      </View>
    );
  }
}
