import { createBottomTabNavigator, createAppContainer } from "react-navigation";

import ChatRoomListTab from "./ChatRoomListTab"
import MyTab from "./MyTab";

import store from "../store/store";

const TabNavigator = createBottomTabNavigator({
  chat: { screen: ChatRoomListTab },
  my: { screen: MyTab }
});

export default createAppContainer(TabNavigator);
