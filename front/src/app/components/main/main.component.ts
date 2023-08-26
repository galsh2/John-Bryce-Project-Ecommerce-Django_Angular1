import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
// import { ProductComponent } from '../product/product.component';
import { ProductService } from 'src/app/services/product.service';
import { ProductComponent } from '../product/product.component';
import { AuthService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  showLogin: boolean = false;
  showRegister: boolean = false;
  showProduct: boolean = true;
  showProfile: boolean = false;
  showPostProfile: boolean = false;
  showOrders: boolean = false;
  
  @ViewChild(ProductComponent) productComponent?: ProductComponent;
  // productComponent = new ProductComponent();
  searchQuery: string = '';
  constructor(private router: Router,private productservice: ProductService,private authService: AuthService) {} // Inject the Router into the constructor

  // goToLogin() {
  //   this.router.navigate(['/login']); // Navigate to the 'login' route
  // }
  // goToRegister() {
  //   this.router.navigate(['/register']); // Navigate to the 'login' route
  // }

  
  goToLogin() {
    this.showLogin = true;
    this.showRegister = false;
    this.showProduct = false;
    this.showProfile = false;
    this.showPostProfile = false;
    this.showOrders = false;
  }

  goToRegister() {
    this.showLogin = false;
    this.showRegister = true;
    this.showProduct = false;
    this.showProfile = false;
    this.showPostProfile = false;
    this.showOrders = false;
  }
  goToProduct() {
    this.showLogin = false;
    this.showRegister = false;
    this.showProduct = true;
    this.showProfile = false;
    this.showPostProfile = false;
    this.showOrders = false;
  }
  goToProfile() {
    this.showLogin = false;
    this.showRegister = false;
    this.showProduct = false;
    this.showProfile = true;
    this.showPostProfile = false;
    this.showOrders = false;
  }
  goToOrders() {
    this.showLogin = false;
    this.showRegister = false;
    this.showProduct = false;
    this.showProfile = false;
    this.showPostProfile = false;
    this.showOrders = true;
  }
  get isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  // goToPostProfile() {
  //   this.showLogin = false;
  //   this.showRegister = false;
  //   this.showProduct = false;
  //   this.showProfile = false;
  //   this.showPostProfile = true;
  // }
  // useSearch() {
  //   // this.products.filterProducts();
  //   if(this.productComponent) {
  //     this.productComponent.filterProducts();
  //   }
  // onSearchChange(event: any): void {
  //   const inputValue = event.target?.value; // Optional chaining to handle null values
  //   if (inputValue) {
  //       this.searchQuery = inputValue;
  //       this.useSearch();
  //   }
  // }
  // useSearch() {
  //   if (this.productComponent) {
  //     this.productComponent.searchText = this.searchQuery;
  //     this.productComponent.filterProducts();
  //   }
  // }
  }

