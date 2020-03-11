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
  noteForm: Note;

  constructor(private fb: FormBuilder, private noteService: NoteService, private snackBar: MatSnackBar, private router: Router) {
  }

  @Input() note: Note;
  @Input() simple ? = false;

  ngOnInit() {
  }

   clickEvent() {

    this.noteService.editToDeleteField(this.note._id, true).subscribe(noteID => {
      this.snackBar.open('Deleted Note ', null, {
        duration: 2000,
      });
      window.location.reload();
      this.router.navigate(['/notes/:', this.note._id]);
    }, err => {
      this.snackBar.open('Failed to delete the note', null, {
        duration: 2000,
      });
    });


    }
  }
