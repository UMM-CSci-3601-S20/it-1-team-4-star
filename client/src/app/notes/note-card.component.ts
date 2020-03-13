import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  noteForm: Note;

  constructor(private fb: FormBuilder, private noteService: NoteService, private snackBar: MatSnackBar, private router: Router) {
  }

  @Input() note: Note;
  @Input() simple ? = false;
  @Output() deleteEvent = new EventEmitter();

  ngOnInit() {
  }

   delete() {
    this.noteService.editToDeleteField(this.note._id, true).subscribe(noteID => {
      this.snackBar.open('Deleted Note ', null, {
        duration: 2000,
      });
      location.reload();
    }, err => {
      this.snackBar.open('Failed to delete the note', null, {
        duration: 2000,
      });
    });
    }

  restore() {
      this.noteService.editToDeleteField(this.note._id, false).subscribe(noteID => {
        this.snackBar.open('Restored Note ', null, {
          duration: 2000,
        });
        //this.deleteEvent.emit(null);
        location.reload();
      }, err => {
        this.snackBar.open('Failed to restore note', null, {
          duration: 2000,
        });
      });
    }

    post() {
      this.noteService.editDraftField(this.note._id, false).subscribe(noteID => {
        this.snackBar.open('Restored Note ', null, {
          duration: 2000,
        });

        // route to home
      }, err => {
        this.snackBar.open('Failed to restore note', null, {
          duration: 2000,
        });
      });
    }

    unpost() {
      if (this.note.draft) {
        delete();
      } else {

      this.noteService.editDraftField(this.note._id, delet).subscribe(noteID => {
        this.snackBar.open('Restored Note ', null, {
          duration: 2000,
        });
        if (this.note.reuse === true) {
          // route to resuable
        } else{
          // route to trash
        }
      }, err => {
        this.snackBar.open('Failed to restore note', null, {
          duration: 2000,
        });
      });
    }
    }
  }
