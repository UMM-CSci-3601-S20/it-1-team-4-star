import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NgModule } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { Note } from './note';
import { NoteService } from './note.service';



@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})



export class NoteCardComponent implements OnInit {


  deleteNoteForm: FormGroup;
  draftNoteForm: FormGroup;
  reuseNoteForm: FormGroup;
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
      // This "hack" may not be good form, but it is the only thing I was able to understand and
      // apply. It is much better than location.reload(), but not as good as using an event emitter (which I tried, but failed at)
      this.router.navigateByUrl('/notes/deleted', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/notes']);
  });
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
        // This "hack" may not be good form, but it is the only thing I was able to understand and
        // apply. It is much better than location.reload(), but not as good as using an event emitter (which I tried, but failed at)
        this.router.navigateByUrl('/notes/deleted', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/notes']);
      });
      }, err => {
        this.snackBar.open('Failed to restore note', null, {
          duration: 2000,
        });
      });
    }

    post() {
      this.noteService.editDraftField(this.note._id, false).subscribe(noteID => {
        this.snackBar.open('Posted Note ', null, {
          duration: 2000,
        });
        // This "hack" may not be good form, but it is the only thing I was able to understand and
        // apply. It is much better than location.reload(), but not as good as using an event emitter (which I tried, but failed at)
        this.router.navigateByUrl('/notes/deleted', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/notes']);
      });
      }, err => {
        this.snackBar.open('Failed to post note', null, {
          duration: 2000,
        });
      });
    }

    unpost() {
      if (this.note.reuse === false) {
        this.delete();
      } else {
      console.log('attempting to remove reusable');
      this.noteService.editDraftField(this.note._id, true).subscribe(noteID => {
        this.snackBar.open('Returned Note ', null, {
          duration: 2000,
        });
        // This "hack" may not be good form, but it is the only thing I was able to understand and
        // apply. It is much better than location.reload(), but not as good as using an event emitter (which I tried, but failed at)
        this.router.navigateByUrl('/notes/deleted', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/notes']);
      });
      }, err => {
        this.snackBar.open('Failed to return note', null, {
          duration: 2000,
        });

      });
    }
  }


  }
