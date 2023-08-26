import { Injectable } from '@angular/core';
import { Observable, Subject, filter, map } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { AuthService } from './authtwo.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cart: any[] = [];
  cartObservable = new Subject<any[]>();
  apiUrl = 'http://localhost:8000/';
  pic: any;

  // constructor(private http: HttpClient, private authService: AuthService) {}
  constructor(private http: HttpClient) { }

  addToCart(product: any): void {
    // console.log(product);
    this.pic = product.product_picture
    let productInCart = this.cart.find(item => item.id === product.id);
    if (productInCart) {
      productInCart.quantity += 1;
      productInCart.totalPrice = productInCart.quantity * productInCart.price;
      productInCart.product_picture = product.product_picture
    } else {
      product.quantity = 1;
      // this.cart.push(product);
      // this.cart.push(product.id, product.name, product.price,product.quantity);
      // let totalprice = product.price * product.quantity;
      product.totalPrice = product.quantity * product.price;
      this.cart.push({ id: product.id, name: product.name, price: product.price, quantity: product.quantity, totalPrice: product.totalPrice, img: product.product_picture });
    }
    this.saveCart();
  }

  // getCart(): any[] {
  //   if (this.authService.isLoggedIn()) {
  //     // If user is logged in, get the cart from backend
  //     this.http.get('/app/cart').subscribe((items: any) => {
  //       this.cart = items;
  //       this.cartObservable.next(this.cart);
  //     });
  //   } else {
  //     // Otherwise, get it from localStorage
  //     this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
  //     this.cartObservable.next(this.cart);
  //   }
  //   return this.cart;
  // }

  getCart(): any[] {
    this.cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return this.cart;
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
    this.saveCart();
  }

  incrementQuantity(index: number): void {
    this.cart[index].quantity++;
    this.saveCart();
  }

  decrementQuantity(index: number): void {
    if (this.cart[index].quantity > 1) {
      this.cart[index].quantity--;
      // this.cart[index].price = this.cart[index].price * this.cart[index].quantity;
      this.saveCart();
    }
  }

  // loadCartAndStore(): void {
  //   this.http.get(this.apiUrl).subscribe(data => {
  //     this.storeToLocalStorage(data);
  //   }, error => {
  //     console.error('Error fetching cart:', error);
  //     // handle your error here, maybe notify the user
  //   });
  // }

  // private storeToLocalStorage(data: any): void {
  //   localStorage.setItem('cart', JSON.stringify(data));
  // }
  // publicloadCart(): Observable<any[]> {


  // public loadCartFromDB(): Observable<any> {
  //   console.log('ll');
    
  //   return this.http.get(`${this.apiUrl}app/get-cart/`).pipe(
  //     map((response: any) => {
  //       const cartData = response.cart;  // Now TypeScript recognizes 'response' as 'any'
  //       this.cart = cartData;
  //       localStorage.setItem('cart', JSON.stringify(this.cart));
  //       this.cartObservable.next(this.cart);
  //       return this.cart;
  //     })
  //   );
  // }
  // public loadCartFromDB(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}app/get-cart/`).pipe(
  //     map((response: any) => response.cart), // Extract cartData from the response
  //     filter((cartData: any[]) => cartData.length > 0), // If cartData is an empty array, exit the stream early
  //     map((cartData: any[]) => {
  //       this.cart = cartData;
  //       localStorage.setItem('cart', JSON.stringify(this.cart));
  //       this.cartObservable.next(this.cart);
  //       return this.cart;
  //     })
  //   );
  // }

  // // saveCart(): void {
  // //   if (this.authService.isLoggedIn()) {
  // //     // If user is logged in, save the cart to the backend
  // //     this.cart.forEach(item => {
  // //       this.http.post('/app/cart', item).subscribe();
  // //     });
  // //   } else {
  // //     // Otherwise, save it to localStorage
  // //     localStorage.setItem('cart', JSON.stringify(this.cart));
  // //   }
  // //   this.cartObservable.next(this.cart);
  // // }

  // private saveCart(): void {
  //   this.authService.onUserLoggedIn.subscribe((loggedIn: boolean) => {
  //     if (loggedIn) {
  //       console.log('User is logged in. Saving cart...');
  //     } else {
  //       console.log('User is not logged in. Cart will be saved locally.');
  //     }

  //     localStorage.setItem('cart', JSON.stringify(this.cart));
  //     this.cartObservable.next(this.cart);
  //   });

  //   // Emit the event to check if the user is logged in
  //   this.authService.checkUserLoggedIn();
  // }

  public loadFromDB(): void {
    const token = localStorage.getItem('access_token');
    // if (!token) {
    //   console.error('No token found');
    //   return;
    // }

    // localStorage.setItem('cart', JSON.stringify(this.cart));
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
  
    this.http.get('http://localhost:8000/app/get-cart/', { headers: headers })
      .subscribe(
        (response: any) => {
          // Assuming the backend returns the cart data in the response
          // localStorage.setItem('cart', JSON.stringify(this.cart));
          const loadedCart = response;

          // Update the local cart object
          this.cart = loadedCart;
          // console.log(this.cart);
          localStorage.setItem('cart', JSON.stringify(this.cart));
          // Notify observers about the updated cart
          this.cartObservable.next(this.cart);
  
          console.log('Cart loaded from DB', this.cart);
        },
        error => {
          console.log('3');
          console.error('Error loading cart from DB', error);
        }
      );
  }


  // private
  public saveCart(): void {
  //     // Check if 'cart' exists in local storage
  // const existingCart = localStorage.getItem('cart');
  
  // // If there's no existing cart, save the current cart to local storage
  // if (!existingCart) {
  //   localStorage.setItem('cart', JSON.stringify(this.cart));
  // }
    // console.log(this.cart);
    
    localStorage.setItem('cart', JSON.stringify(this.cart));
    // this.loadCartFromDB()
    this.cartObservable.next(this.cart);


    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No token found');
      return;
    }
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + token
    });
    // console.log(this.cart);
    
    this.http.post('http://localhost:8000/app/save-cart/', this.cart, { headers: headers })
      .subscribe(
        response => {
          console.log(response);
          
          console.log('Cart saved successfully', response);
        },
        error => {
          console.error('Error saving cart in DB', error);
        }
      );

    // // Send the cart data to the Django backend if the user is authenticated.
    // this.http.post('http://localhost:8000/app/save-cart/', this.cart).subscribe(response => {
    //   console.log('Cart saved in DB', response);
    // }, error => {
    //   console.error('Error saving cart in DB', error);
    // });

  }
}




// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {

//   constructor() { }
// }
