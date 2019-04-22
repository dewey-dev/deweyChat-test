import {
  RECV_AUTH_CHECK_RESULT,
  LOGIN_STATE_CHANGED,
  USERINFO_CHANGED,
} from "../actions/LoginAction";

const initialState = {
  showStartScreen: true,
  isLogin: false,
  user: {
    id: "",
    name: "",
    email: "",
    profileImage: ""
  }
};

const applyUserInfo = (state, action) => {
  console.log("userInfo changed: ", action.user);
  return {
    ...state,
    user: action.user
  };
};

const applyRecvAuthCheckResult = (state, action) => {
  console.log("isLogin changed: " + action.isLogin);
  return {
    ...state,
    showStartScreen: false,
    isLogin: action.isLogin
  };
};

const applyLoginStateChanged = (state, action) => {
  console.log("islogin changed: " + action.isLogin);
  return {
    ...state,
    isLogin: action.isLogin
  };
};


const LoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECV_AUTH_CHECK_RESULT:
      return applyRecvAuthCheckResult(state, action);
    case LOGIN_STATE_CHANGED:
      return applyLoginStateChanged(state, action);
    case USERINFO_CHANGED:
      return applyUserInfo(state, action);
    default:
      return state;
  }
};

export default LoginReducer;
