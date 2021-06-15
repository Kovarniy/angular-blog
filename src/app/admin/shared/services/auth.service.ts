import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {FbAuthResponse, User} from "../../../shared/interfaces";
import {Observable} from "rxjs";
import {environment} from "../../../../environments/environment";
import {tap} from "rxjs/operators";

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {
  }

  get token(): string {
    const expDate = new Date(localStorage.getItem('token-exp'))
    if (new Date() > expDate){
      this.logout()
      return null
    }

    return localStorage.getItem('token')
  }

  login(user: User): Observable<any> {
    // user.returnSecureToken = true
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user).
      pipe(tap(this.setToken))
  }

  logout() {
    this.setToken(null)
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  private setToken(resp: FbAuthResponse | null) {
    if (resp) {
      // Время жизни токена - текущая дата в ms + expiresIn в ms
      const expDate = new Date(new Date().getTime() + +resp.expiresIn * 1000 )
      localStorage.setItem('token', resp.idToken)
      localStorage.setItem('token-exp', expDate.toString())
    } else {
      localStorage.clear()
    }
  }
}
