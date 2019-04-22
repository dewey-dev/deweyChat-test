import React from "react";
import { Provider } from "react-redux";

import Root from "./src/containers/Root";
import store from "./src/store/store";

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Root />
      </Provider>
    );
  }
}
