export default class FormatChecker {
  static validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var result = re.test(String(email).toLowerCase());
    return {
      result: result,
      message: result === true ? "" : "이메일 확인"
    };
  }

  static validateNickName(nickName) {
    check = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if (check.test(String(nickName))) {
      return {
        result: false,
        message: "닉네임은 영어로만 입력 가능합니다."
      };
    } else {
      return {
        result: true,
        message: ""
      };
    }
  }

  static validatePassword(password, confirmPassword) {
    var result = false;
    var message = "";
    if (password === confirmPassword) {
      result = true;
    } else {
      message = "비밀번호가 일치하지 않습니다.";
    }

    return {
      result: result,
      message: message
    };
  }

  static signUpEnableCheck(
    profileImage,
    name,
    email,
    password,
    confirmPassword
  ) {
    console.log(name);
    console.log(email);
    console.log(password);
    console.log(confirmPassword);

    if (
      name.length == 0 ||
      email.length == 0 ||
      password.length == 0 ||
      confirmPassword.length == 0
    ) {
      console.log("length failed");
      return false;
    }

    if (!profileImage) {
      console.log("profile image null");
      return false;
    }

    if (FormatChecker.validateEmail(email).result == false) {
      console.log("validateEmail failed");
      return false;
    }

    if (FormatChecker.validateNickName(name).result == false) {
      console.log("validateNickName failed");
      return false;
    }

    if (password !== confirmPassword) {
      console.log("password matching failed");
      return false;
    }

    return true;
  }

  static makeChatRoomId(a, b) {
    if (a > b) {
      return a + "-" + b;
    } else {
      return b + "-" + a;
    }
  }

  static makeDateString(timestamp) {
    var x = new Date(timestamp);
    var y = x.getFullYear().toString();
    var m = (x.getMonth() + 1).toString();
    var d = x.getDate().toString();
    d.length == 1 && (d = "0" + d);
    m.length == 1 && (m = "0" + m);
    var yyyymmdd = y + "-" + m + "-" + d;
    return yyyymmdd;
  }
}
