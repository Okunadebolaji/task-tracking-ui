import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TempPasswordService {
  tempPassword: string | null = null;

  setPassword(pw: string) {
    this.tempPassword = pw;
  }

  getPassword(): string | null {
    return this.tempPassword;
  }

  clear() {
    this.tempPassword = null;
  }
}
