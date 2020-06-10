import 'isomorphic-fetch';
import AppConfig from './AppConfig';
import { IAuth } from './Contract';

const request = async (method, endpoint) => {
  return await fetch(AppConfig.AuthURL + endpoint, {
    method: method,
    mode: 'cors',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};

export default class AuthService {
  static auth?: IAuth;

  static fillAuthData = () => {
    AuthService.auth = JSON.parse(localStorage.getItem('auth') || 'null');
    return AuthService.auth;
  };

  static store = auth => {
    localStorage.setItem('auth', JSON.stringify(auth));
    AuthService.OnAuthChange();
  };

  static login = async (username, password) => {
    let data = `username=${username}&password=${password}`;
    try {
      let response = await request('POST', 'auth/credentials.json?' + data);
      if (!response.ok) throw 'Invalid';
      let userAuth = await response.json();
      let responseInfoUser = await request('GET', 'Account/' + userAuth.UserId + '.json');
      if (!responseInfoUser.ok) throw 'Invalid user account';
      let userInfoAccount = await responseInfoUser.json();
      AuthService.auth = {
        user: userAuth,
        account: userInfoAccount
      };
      AuthService.store(AuthService.auth);
      // AuthService.ON_LOGIN();
      AuthService.ResolveLoginPromise(AuthService.auth);
      return AuthService.auth;
    } catch (e) {
      console.log(e);
      throw 'Invalid Username or Password.';
    }
  };

  static setAccountLocalStorage = account => {
    AuthService.fillAuthData();
    if (AuthService.auth) {
      AuthService.auth.account = account;
      AuthService.store(AuthService.auth);
    }
  };

  static logout = async () => {
    localStorage.removeItem('auth');
    AuthService.auth = undefined;
    await request('GET', 'auth/logout').then(r => {
      console.log(r);
    });
  };

  static ON_LOGIN = () => {};

  static OpenLogin = () => {};

  static OnAuthChange = () => {};

  private static ResolveLoginPromise(result: any) {}

  static RequestLogin = async () => {
    AuthService.OpenLogin();
    return new Promise((resolve, reject) => {
      AuthService.ResolveLoginPromise = resolve;
    });
  };
}
