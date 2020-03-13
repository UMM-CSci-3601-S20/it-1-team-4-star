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
  draftNoteForm: FormGroup;
  reuseNoteForm: FormGroup;


  constructor(private fb: FormBuilder, private noteService: NoteService, private snackBar: MatSnackBar, private router: Router) {
  }


  add_note_validation_messages = {
    body: [
      {type: 'required', message: 'Body message is required'},
      {type: 'minlength', message: 'Body message must be at least 2 characters long'},
      {type: 'maxlength', message: 'Body message must be no more than 120 characters long'}
    ],

    reuse: [
      {type: 'required', message: 'Reuse field is required'},
      { type: 'pattern', message: 'Reuse must be True or False' }
    ],

    draft: [
      {type: 'required', message: 'Draft field is required'},
      { type: 'pattern', message: 'Reuse must be True or False' }
    ],

    toDelete: [
      {type: 'required', message: 'toDelete field is required'},
      {type: 'pattern', message: 'Reuse must be True or False' }
    ]
  };

  createForms() {

    // add note form validations
    this.addNoteForm = this.fb.group({
      body: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(120),
        //Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?')
      ])),

      reuse: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(true|false)$'),
      ])),

      draft: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(true|false)$'),
      ])),

      toDelete: new FormControl('false', Validators.compose([
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
      this.snackBar.open('Added Note ', null, {
        duration: 2000,
      });
      this.router.navigate(['/notes']);
    }, err => {
      this.snackBar.open('Failed to add the note', null, {
        duration: 2000,
      });
    });
  }

}
