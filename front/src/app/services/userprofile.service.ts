import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserprofileService {

  private apiUrl = 'http://localhost:8000/app/create-user-profile/';

  constructor(private http: HttpClient) { }

  // showPostProfile = false;
  // showLogin = false;
  // showRegister = false;
  // showProfile = false;

  getToken() {
    return localStorage.getItem('access_token');
  }

  // goToPostProfile() {
  //   // this.showLogin = false;
  //   // this.showRegister = false;
  //   // this.showProduct = false;
  //   // this.showProfile = false;
  //   this.showPostProfile = true;
  // }

  // GET request
  getUserProfile(): Observable<any> {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': `Token ${this.getToken()}`
    // });
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + `${this.getToken()}`
    });

    return this.http.get(this.apiUrl, { headers });
  }

  // POST request
  createUserProfile(data: any, file?: File): Observable<any> {
    const formData: FormData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        formData.append(key, data[key]);
      }
    }
    if (file) {
      formData.append('profile_picture', file, file.name);
    }
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': `${this.getToken()}`
    // });
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + `${this.getToken()}`
    });

    return this.http.post(this.apiUrl, formData, { headers });
    // return this.http.post(this.apiUrl, data, { headers });
  }
}



// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class UserprofileService {

//   constructor() { }
// }
