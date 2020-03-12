import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Note, reusable, draft, toDelete } from './note';
import { NoteService } from './note.service';

@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.scss']
})
export class AddNoteComponent implements OnInit {

  addNoteForm: FormGroup;

  note: Note;



  public reusable: reusable;
  public draft: draft;
  public toDelete: toDelete;

  constructor(private fb: FormBuilder, private noteService: NoteService, private snackBar: MatSnackBar, private router: Router) {
  }

  // not sure if this owner is magical and making it be found or if I'm missing something,
  // but this is where the red text that shows up (when there is invalid input) comes from
  add_note_validation_messages = {


    /*owner: [
      {type: 'required', message: 'Owner name is required'},
      {type: 'minlength', message: 'Owner name must be at least 2 characters long'},
      {type: 'maxlength', message: 'Owner name cannot be more than 50 characters long'},
      {type: 'pattern', message: 'Owner name must contain only numbers and letters'},
      {type: 'existingName', message: 'Owner name has already been taken'}
    ],*/

    body: [
      {type: 'required', message: 'Body message is required'},
      {type: 'minlength', message: 'Body message must be at least 2 characters long'},
      {type: 'maxlength', message: 'Body message must be no more than 120 characters long'}
    ],

    reusable: [
      {type: 'required', message: 'Reusable field is required'},
      { type: 'pattern', message: 'Reusable must be True or False' }
    ],

    draft: [
      {type: 'required', message: 'Draft field is required'},
      { type: 'pattern', message: 'Reusable must be True or False' }
    ],

    toDelete: [
      {type: 'required', message: 'toDelete field is required'},
      { type: 'pattern', message: 'Reusable must be True or False' }
    ]
  };

  createForms() {

    // add note form validations
    this.addNoteForm = this.fb.group({
      // We allow alphanumeric input and limit the length for owner.
/*
      owner: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        // In the real world you'd want to be very careful about having
        // an upper limit like this because people can sometimes have
        // very long owners. This demonstrates that it's possible, though,
        // to have maximum length limits.
        Validators.maxLength(25),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?'),
        (fc) => {
          if (fc.value.toLowerCase() === 'abc123' || fc.value.toLowerCase() === '123abc') {
            return ({existingOwner: true});
          } else {
            return null;
          }
        },
      ])),
*/
      body: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(120),
        //Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?')
      ])),

      reusable: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(true|false)$'),
      ])),

      draft: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(true|false)$'),
      ])),

      toDelete: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(true|false)$'),
      ]))

    });

  }

  ngOnInit() {
    this.createForms();
  }


  submitForm() {
    this.noteService.addNote(this.addNoteForm.value).subscribe(newID => {
      this.snackBar.open('Added Note ' + this.addNoteForm.value, null, {
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
