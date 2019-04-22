export const RECV_AUTH_CHECK_RESULT = "RECV_AUTH_CHECK_RESULT";
export const LOGIN_STATE_CHANGED = "LOGIN_STATE_CHANGED";
export const USERINFO_CHANGED = "USERINFO_CHANGED";

export const recvAuthCheckResult = isLogin => ({
  type: RECV_AUTH_CHECK_RESULT,
  isLogin
});

export const loginStateIsChanged = isLogin => ({
  type: LOGIN_STATE_CHANGED,
  isLogin
});

export const userInfoIsChanged = user => ({
  type: USERINFO_CHANGED,
  user
});
