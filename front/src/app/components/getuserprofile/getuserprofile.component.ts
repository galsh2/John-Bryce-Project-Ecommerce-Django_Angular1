import { UserprofileService } from 'src/app/services/userprofile.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-getuserprofile',
  templateUrl: './getuserprofile.component.html',
  styleUrls: ['./getuserprofile.component.css']
})
export class GetuserprofileComponent implements OnInit {
  userProfile: any;
  error: boolean = false;

  constructor(private userProfileService: UserprofileService) { }

  ngOnInit() {
    // this.userProfileService.getUserProfile().subscribe(
    //   data => {
    //     this.userProfile = data[0];
    //     // console.log(this.userProfile);
    //     console.log(data[0]);
        
    //   },
    //   error => {
    //     console.error('Error fetching user profile:', error);
    //     this.error = true;
    //   }
    // );
    this.userProfileService.getUserProfile().subscribe(
      data => {
        if (data[0] === null || data[0] === undefined) {
          console.error('Error: data[0] is null or undefined.');
          this.error = true;
          return;
        }
        this.userProfile = data[0];
        console.log(data[0]);
      },
      error => {
        console.error('Error fetching user profile:', error);
        this.error = true;
      }
    );
    // ngOnInit(): void {
    //   this.userProfileService.getUserProfile().subscribe(data => {
    //     this.userProfile = data[0];
    //   });
  }
  // goToPost(): void {
  //   this.userProfileService.goToPostProfile()
  // }
}




// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-getuserprofile',
//   templateUrl: './getuserprofile.component.html',
//   styleUrls: ['./getuserprofile.component.css']
// })
// export class GetuserprofileComponent {

// }
