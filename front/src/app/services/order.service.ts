import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8000/app';

  constructor(private http: HttpClient) { }

  getUserOrders(): Observable<any> {
    const endpoint = `${this.apiUrl}/get-order/`; // Replace with the actual endpoint
    const token = localStorage.getItem('access_token'); 
    if (!token) {
      throw new Error('Token not found in local storage.');
    }
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);
    return this.http.get(endpoint, { headers: headers });
  }

  // generateOrder(cartItems: any,orderID: string): Observable<any> {
  generateOrder(paymentID: any): Observable<any> {
    const endpoint = `${this.apiUrl}/save-order/`;

    // Fetch the token from local storage
    const token = localStorage.getItem('access_token'); 

    if (!token) {
      throw new Error('Token not found in local storage.');
    }

    // Set the token in the headers
    const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

    // return this.http.post(endpoint, { cart_items: cartItems, order_id: orderID }, { headers: headers });
    return this.http.post(endpoint, {  payment_id: paymentID }, { headers: headers });

  }

  // PaymentStatus(paymentId: string, orderId: string): Observable<any> {
  //   const endpoint = `${this.apiUrl}/app/payment_status/`;

  //   // Fetch the token from local storage
  //   const token = localStorage.getItem('access_token'); 

  //   if (!token) {
  //     throw new Error('Token not found in local storage.');
  //   }

  //   // Set the token in the headers
  //   const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

  //   return this.http.post(endpoint, { payment_id: paymentId, order_id: orderId }, { headers: headers });
  // }
}  
//   generateOrder(cartItems: any): Observable<any> {
//     const endpoint = `${this.apiUrl}/app/save-order/`; // replace with your endpoint
//     return this.http.post(endpoint, { cart_items: cartItems });
//   }
// }
// //   order(): void {
// //     const token = localStorage.getItem('access_token');
// //     const headers = new HttpHeaders({
// //       'Authorization': 'Bearer ' + token
// //     });
// //     this.http.get('http://localhost:8000/app/save-order/', { headers: headers })
// //       .subscribe(
// //         (response: any) => {
// //           // Assuming the backend returns the cart data in the response
// //           // localStorage.setItem('cart', JSON.stringify(this.cart));
// //           const loadedCart = response;

// //           // Update the local cart object
// //           this.cart = loadedCart;
// //           // console.log(this.cart);
// //           localStorage.setItem('cart', JSON.stringify(this.cart));
// //           // Notify observers about the updated cart
// //           this.cartObservable.next(this.cart);
  
// //           console.log('Cart loaded from DB', this.cart);
// //         },
// // )}
// // }
