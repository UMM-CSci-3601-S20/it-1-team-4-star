import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Note } from './note';
import { NoteService } from './note.service';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.scss']
})
export class AddNoteComponent implements OnInit {



  addNoteForm: FormGroup;

  note: Note;

  constructor(private fb: FormBuilder, private noteService: NoteService, private snackBar: MatSnackBar, private router: Router) {
  }

  // not sure if this name is magical and making it be found or if I'm missing something,
  // but this is where the red text that shows up (when there is invalid input) comes from
  add_note_validation_messages = {
    owner: [
      {type: 'required', message: 'Owner is required'},
      {type: 'minlength', message: 'Owner name must be at least 2 characters long'},
      {type: 'maxlength', message: 'Owner name cannot be more than 20 characters long'},
      {type: 'pattern', message: 'Owner must contain only numbers and letters'}
    ],

    reusable: [
      {type: 'required', message: 'Reusable boolean value is required'}
    ],

    draft: [
      {type: 'required', message: 'Draft boolean value is required'}
    ],

    toDelete: [
      {type: 'required', message: 'Delete value is required'}
    ],

    body: [
      {type: 'required', message: 'Body is required'},
      {type: 'minlength', message: 'Body must be at least 2 characters long'},
      {type: 'maxlength', message: 'Body must be no more than 25 characters long'}
    ]
  };

  createForms() {

    // add note form validations
    this.addNoteForm = this.fb.group({
      // We allow alphanumeric input and limit the length for name.
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        // In the real world you'd want to be very careful about having
        // an upper limit like this because people can sometimes have
        // very long names. This demonstrates that it's possible, though,
        // to have maximum length limits.
        Validators.maxLength(20),
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
        Validators.pattern('^\\d+$'),
      ]))

    });

  }

  ngOnInit() {
    this.createForms();
  }


  submitForm() {
    this.noteService.addNote(this.addNoteForm.value).subscribe(newID => {
      this.snackBar.open('Added Note ' + this.addNoteForm.value.name, null, {
        duration: 2000,
      });
      this.router.navigate(['/notes/', newID]);
    }, err => {
      this.snackBar.open('Failed to add the note', null, {
        duration: 2000,
      });
    });
  }

}
