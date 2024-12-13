import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  getAuthUser(): string | null {
    return localStorage.getItem('auth-user');
  }

  isLoggedIn() {
    let authLogin = JSON.parse(this.getAuthUser() || '{}');
    if(
      Object.keys(authLogin).length != 0 &&
      authLogin.token != '' &&
      authLogin.branchCode != '' &&
      authLogin.jobCode != '' &&
      authLogin.jobDesc != '' &&
      authLogin.emplNo != '' &&
      authLogin.emplNpk != '' &&
      authLogin.nik != '' &&
      authLogin.fullName != '' &&
      authLogin.emplBankCode != '' &&
      authLogin.emplAccNo != '' &&
      authLogin.skeleton != ''
      ) {
      return true;
    }else {
      return false;
    }
  }
}
