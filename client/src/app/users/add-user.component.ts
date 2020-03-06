import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from './user';
import { UserService } from './user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  addUserForm: FormGroup;

  user: User;

  constructor(private fb: FormBuilder, private userService: UserService, private snackBar: MatSnackBar, private router: Router) {
  }

  // not sure if this name is magical and making it be found or if I'm missing something,
  // but this is where the red text that shows up (when there is invalid input) comes from
  add_user_validation_messages = {
    name: [
      {type: 'required', message: 'Name is required'},
      {type: 'minlength', message: 'Name must be at least 2 characters long'},
      {type: 'maxlength', message: 'Name cannot be more than 50 characters long'},
      {type: 'pattern', message: 'Name must contain only numbers and letters'},
      {type: 'existingName', message: 'Name has already been taken'}
    ],

    email: [
      {type: 'email', message: 'Email must be formatted properly'},
      {type: 'required', message: 'Email is required'},
      {type: 'existingName', message: 'Email has already been taken'}
    ],

    building: [
<<<<<<< HEAD
      {type: 'required', message: 'Building is required'},
      {type: 'maxlength', message: 'Building cannot be more than 30 characters long'}
=======
      {type: 'required', message: 'Building name is required'},
      {type: 'minlength', message: 'Building name must be at least 2 characters long'},
      {type: 'maxlength', message: 'Office number name must be no more than 25 characters long'},
      {type: 'pattern', message: 'Building name must contain only numbers and letters'}
>>>>>>> Fix html validation calls for add user feature
    ],

    officeNumber: [
      {type: 'required', message: 'Office number is required'},
<<<<<<< HEAD
      {type: 'maxlength', message: 'Office cannot be more than 30 characters long'},
      {type: 'pattern', message: 'Office number must contain only numbers'},
      {type: 'existingName', message: 'Office number has already been taken'}
=======
      {type: 'minlength', message: 'Office number name must be at least one character long'},
      {type: 'maxlength', message: 'Office number name must be no more than 6 characters long'},
      {type: 'pattern', message: 'Office must only contain numbers'}
>>>>>>> Fix html validation calls for add user feature
    ]
  };

  createForms() {

    // add user form validations
    this.addUserForm = this.fb.group({
      // We allow alphanumeric input and limit the length for name.
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        // In the real world you'd want to be very careful about having
        // an upper limit like this because people can sometimes have
        // very long names. This demonstrates that it's possible, though,
        // to have maximum length limits.
        Validators.maxLength(50),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
        (fc) => {
          if (fc.value.toLowerCase() === 'abc123' || fc.value.toLowerCase() === '123abc') {
            return ({existingName: true});
          } else {
            return null;
          }
        },
      ])),

      // We don't need a special validator just for our app here, but there is a default one for email.
      // We will require the email, though.
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.email,
      ])),

      building: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
      ])),

      officeNumber: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(6),
        Validators.pattern('^\\d+'),
      ]))

    });

  }

  ngOnInit() {
    this.createForms();
  }


  submitForm() {
    this.userService.addUser(this.addUserForm.value).subscribe(newID => {
      this.snackBar.open('Added User ' + this.addUserForm.value.name, null, {
        duration: 2000,
      });
      this.router.navigate(['/users/', newID]);
    }, err => {
      this.snackBar.open('Failed to add the user', null, {
        duration: 2000,
      });
    });
  }

}
