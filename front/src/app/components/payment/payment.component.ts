// import { Component, OnInit } from '@angular/core';

// declare global {
//   interface Window {
//     paypal?: any;
//   }
// }

// @Component({
//   selector: 'app-payment',
//   templateUrl: './payment.component.html',
//   styleUrls: ['./payment.component.css']
// })
// export class PaymentComponent implements OnInit {

//   ngOnInit() {
//     // this.getCartFromLocalStorage();
//     this.calculateGrandTotal();
//     this.initPaypalButton();
//   }

//   // getCartFromLocalStorage() {
//   //   const cart = localStorage.getItem('cart');

//   //   if (cart) {
//   //     console.log('Cart from Local Storage:', JSON.parse(cart));
//   //   } else {
//   //     console.log('No cart found in Local Storage.');
//   //   }
//   // }
//   calculateGrandTotal() {
//     const cart = localStorage.getItem('cart');
//     const cartItems = cart ? JSON.parse(cart) : [];

//     let grandTotal = 0;

//     for (const item of cartItems) {
//         const itemTotal = item.quantity * parseFloat(item.price);
//         grandTotal += itemTotal;
//     }

//     // console.log('Grand Total:', grandTotal.toFixed());
//     console.log('Grand Total:', grandTotal);
//   }

//   // initPaypalButton() {
//   //   if (!window.paypal) {
//   //     console.error('Paypal SDK not loaded.');
//   //     return;
//   //   }

// //     window.paypal.Buttons({
// //       createOrder: (data, actions) => {
// //         return actions.order.create({
// //           purchase_units: [{
// //             amount: {
// //               value: this.grandTotal.toFixed(2) // Use toFixed to ensure it's in a valid format
// //             }
// //           }]
// //         });
// //       },
// //       onApprove: (data, actions) => {
// //         return actions.order.capture().then((details) => {
// //           console.log('Order approved:', details);
// //           // Handle post-payment logic here
// //         });
// //       },
// //       onError: (err) => {
// //         console.error('Payment error:', err);
// //         // Handle errors here
// //       }
// //     }).render('#paypal-button-container');  // This is where you want the button to be rendered
// //   }
// // }
// initPaypalButton() {
//   if (!window.paypal) {
//     console.error('Paypal SDK not loaded.');
//     return;
//   }

//   window.paypal.Buttons({
//     createOrder: (data: any, actions: any) => {
//       return actions.order.create({
//         purchase_units: [{
//           amount: {
//             value: this.grandTotal.toFixed(2) // Use toFixed to ensure it's in a valid format
//           }
//         }]
//       });
//     },
//     onApprove: (data: any, actions: any) => {
//       return actions.order.capture().then((details: any) => {
//         console.log('Order approved:', details);
//         // Handle post-payment logic here
//       });
//     },
//     onError: (err: any) => {
//       console.error('Payment error:', err);
//       // Handle errors here
//     }
//   }).render('#paypal-button-container');  // This is where you want the button to be rendered
// }}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/authentication.service';
import { OrderService } from 'src/app/services/order.service';
import { UserprofileService } from 'src/app/services/userprofile.service';

declare global {
  interface Window {
    paypal?: any;
  }
}

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})

export class PaymentComponent implements OnInit {

  paymentId!: string ;
  // orderId: string | null = null;
  orderId!: string

  constructor(public authService: AuthService,private userProfileService: UserprofileService,private router: Router,private orderService: OrderService) {} // Inject the AuthService

  cartItems = this.getCartItemsFromLocalStorage();

  ngOnInit() {
    this.calculateGrandTotal();
    if (this.authService.isLoggedIn()) { // Check if user is logged in
      // console.log('1');
      this.checkUserProfileExists();
      // this.initPaypalButton();
    }
  }


  getCartItemsFromLocalStorage(): any {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  }

  // savePaymentID() {
  //     // Call the PaymentStatus function after generating the order
  //     this.orderService.PaymentStatus(this.paymentId, this.orderId).subscribe(
  //       res => console.log('Payment status saved successfully:', res),
  //       err => console.error('Error saving payment status:', err)
  //     );
  //   // this.orderService.PaymentStatus(this.paymentId ,this.orderId).subscribe(
  //   //   response => {

  //   //   })
  // }
  generateOrder(payment:any) {
    this.orderService.generateOrder(payment).subscribe(
      response => {
        // let order =  response.order_id
        // this.orderId = response.order_id;  // Save Order ID
        console.log('Order generated with ID:', response.order_id);
        alert('Order generated successfully! your order id is: '+ response.order_id);
        
      },
      error => {
        console.error('Error generating order:', error);
        alert('Failed to generate order.');
      }
    );
  }
  // generateOrder() {
  //   this.orderService.generateOrder(this.cartItems,this.orderId).subscribe(
  //     response => {
  //       // let order =  response.order_id
  //       this.orderId = response.order_id;  // Save Order ID
  //       console.log('Order generated with ID:', response.order_id);
  //       alert('Order generated successfully! your order id is: '+ response.order_id);
        
  //     },
  //     error => {
  //       console.error('Error generating order:', error);
  //       alert('Failed to generate order.');
  //     }
  //   );
  // }

  checkUserProfileExists() {
    this.userProfileService.getUserProfile().subscribe(
      data => {
        if (data && data.length > 0) {  // Check if user profile exists
          this.initPaypalButton();
        } else {
          // No user profile found, redirect to '/postuserprofile'
          this.router.navigateByUrl('/postuserprofile');
        }
      },
      error => {
        console.error('Error fetching user profile:', error);
      }
    );
  }

  grandTotal: number = 0; // Declare it here as a class property

  // ngOnInit() {
  //   this.calculateGrandTotal();
  //   this.initPaypalButton();
  // }

  calculateGrandTotal() {
    const cart = localStorage.getItem('cart');
    const cartItems = cart ? JSON.parse(cart) : [];

    this.grandTotal = 0; // Reset it to 0 before calculating

    for (const item of cartItems) {
        const itemTotal = item.quantity * parseFloat(item.price);
        this.grandTotal += itemTotal;
    }

    console.log('Grand Total:', this.grandTotal);
  }

  initPaypalButton() {
    if (!window.paypal) {
      console.error('Paypal SDK not loaded.');
      return;
    }

    window.paypal.Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              value: this.grandTotal.toFixed(2) // Use the class property here
            }
          }]
        });
      },
      onApprove: (data: any, actions: any) => {
        return actions.order.capture().then((details: any) => {
          this.paymentId = details.id;  // Save Payment ID
          console.log('Order approved:', details);
          // console.log("Payment ID:", details.id);
          this.generateOrder(details.id);
          // this.savePaymentID();
          localStorage.removeItem('cart');
        });
      },
      onError: (err: any) => {
        console.error('Payment error:', err);
      }
    }).render('#paypal-button-container');
  }
}





// // import { AfterViewInit,Component, ElementRef, OnInit, ViewChild } from '@angular/core';
// // import { Router } from '@angular/router';

// // @Component({
// //   selector: 'app-payment',
// //   templateUrl: './payment.component.html',
// //   styleUrls: ['./payment.component.css']
// // })
// // export class PaymentComponent implements OnInit{

// //   amount = 0;
// //   @ViewChild('paymentRef', { static: true }) paymentRef: ElementRef;
// //   constructor(private router: Router ) { }

// //   ngOnInit(): void {
// //     // this.amount = localStorage.getItem('cart');
// //     console.log();
    
// //   }
// // }

// // import { AfterViewInit,Component } from '@angular/core';

// // @Component({
// //   selector: 'app-payment',
// //   templateUrl: './payment.component.html',
// //   styleUrls: ['./payment.component.css']
// // })
// // export class PaymentComponent {
// //   ngAfterViewInit(): void {
// //     paypal.Buttons({
// //       createOrder: (data, actions) => {
// //         return actions.order.create({
// //           purchase_units: [{
// //             amount: {
// //               value: '0.01' // Set your amount here
// //             }
// //           }]
// //         });
// //       },
// //       onApprove: (data, actions) => {
// //         return actions.order.capture().then(details => {
// //           console.log(details);
// //           // Show a success message, etc.
// //         });
// //       },
// //       onError: err => {
// //         console.log(err);
// //         // Handle errors here
// //       }
// //     }).render('#paypal-button-container');
// //   }
// // }
// // import { AfterViewInit, Component } from '@angular/core';

// // declare var paypal;

// // @Component({
// //   selector: 'app-paypal-button',
// //   template: '<div id="paypal-button-container"></div>',
// //   styleUrls: ['./paypal-button.component.css']
// // })
// // export class PaypalButtonComponent implements AfterViewInit {

// //   ngAfterViewInit(): void {
// //     paypal.Buttons({
// //       createOrder: (data, actions) => {
// //         return actions.order.create({
// //           purchase_units: [{
// //             amount: {
// //               value: '0.01' // Set your amount here
// //             }
// //           }]
// //         });
// //       },
// //       onApprove: (data, actions) => {
// //         return actions.order.capture().then(details => {
// //           console.log(details);
// //           // Show a success message, etc.
// //         });
// //       },
// //       onError: err => {
// //         console.log(err);
// //         // Handle errors here
// //       }
// //     }).render('#paypal-button-container');
// //   }
// // }