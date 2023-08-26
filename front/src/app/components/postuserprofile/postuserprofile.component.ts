// create-profile.component.ts

import { Component } from '@angular/core';
import { UserprofileService } from 'src/app/services/userprofile.service';
// import { UserProfileService } from './user-profile.service';

@Component({
  selector: 'app-postuserprofile',
  templateUrl: './postuserprofile.component.html',
  styleUrls: ['./postuserprofile.component.css']
})
export class PostuserprofileComponent {

  profileData = {
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: ''
    // ... other fields ...
  };
  selectedFile?: File;
  // selectedFile: File | null = null;
  constructor(private userProfileService: UserprofileService) { }
  onFileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
        this.selectedFile = input.files[0];
    }
  }

  createProfile() {
    this.userProfileService.createUserProfile(this.profileData, this.selectedFile).subscribe(
      data => {
        console.log('Profile created successfully', data);
      },
      error => {
        console.error('Error creating profile:', error);
      }
    );
  }
}


// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-postuserprofile',
//   templateUrl: './postuserprofile.component.html',
//   styleUrls: ['./postuserprofile.component.css']
// })
// export class PostuserprofileComponent {

// }
