export function ValidateEmail(mail) {
  if (mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
      return true;
    } else {
      // alert('You have entered an invalid email address!');
      return false;
    }
  } else {
    return true;
  }
}

export function ValidatePassword(inputtxt) {
  if (inputtxt) {
    let passw = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if (inputtxt.match(passw)) {
      return true;
    } else {
      return false;
    }
  } else {
    return true;
  }
}
