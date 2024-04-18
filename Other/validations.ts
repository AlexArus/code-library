const emailRegExp =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]*[a-z0-9]+\.)+[a-zA-Z]{2,}))$/;

export const isEmail = (email: string) => emailRegExp.test(email);
