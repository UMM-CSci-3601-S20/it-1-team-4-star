import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Note } from './note';
import { NoteService } from './note.service';


@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit {


  deleteNoteForm: FormGroup;
  note: Note;

  constructor(private fb: FormBuilder, private noteService: NoteService, private snackBar: MatSnackBar, private router: Router){
  }

  @Input() Note: Note;
  @Input() simple ? = false;


  add_note_validation_messages = {
  };

  createForms() {
  }

  ngOnInit(): void {
    this.createForms();
  }


  submitForm() {
    this.noteService.deleteNote(this.deleteNoteForm.value).subscribe(newID => {
      this.snackBar.open('Deleted Note ' + this.deleteNoteForm.value.name, null, {
        duration: 2000,
      });
      this.router.navigate(['/notes/', newID]);
    }, err => {
      this.snackBar.open('Failed to delete the note', null, {
        duration: 2000,
      });
    });
  }



}
