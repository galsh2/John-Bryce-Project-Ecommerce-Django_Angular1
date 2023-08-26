import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:8000/app/product/';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  //   // // Get products (requires an authenticated user)
  //   // getProducts(accessToken: string) {
  //   //   const headers = new HttpHeaders({ 'Authorization': 'Bearer ' + accessToken });
  //   //   return this.http.get<any>(this.apiUrl , { headers });
  //   // }
  getProductById(id: number): Observable<any> {
    return this.http.get<any>(this.apiUrl + id);
  }

  // getProducts(searchQuery?: string): Observable<any[]> {
  //   if (searchQuery) {
  //     return this.http.get<any[]>(`${this.apiUrl}`);
  //     // search=${searchQuery}
  //   }
  //   return this.http.get<any[]>(this.apiUrl);
  // }
}





// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class ProductService {

//   constructor() { }
// }
