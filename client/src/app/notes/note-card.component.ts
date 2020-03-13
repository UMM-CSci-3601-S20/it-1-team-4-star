import { Component, OnInit, Input, Output } from '@angular/core';
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

  ngOnInit() {
  }

   delete() {
    this.noteService.editToDeleteField(this.note._id, true).subscribe(noteID => {
      this.snackBar.open('Removed Note ', null, {
        duration: 2000,
      });
      // This "hack" may not be good form, but it is the only thing I was able to understand and
      // apply. It is much better than location.reload(), but not as good as using an event emitter (which I tried, but failed at)
      if (this.note.reuse === true) {
        this.router.navigateByUrl('/notes', { skipLocationChange: false }).then(() => {
        this.router.navigate(['/notes/reuse']);   });
        } else if (this.note.draft === false && this.note.reuse === false) {
        this.router.navigateByUrl('/notes/draft', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/notes']);     });
      } else if (this.note.draft === true && this.note.reuse === false) {
        this.router.navigateByUrl('/notes', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/notes/draft']);     });
      } else {
        this.router.navigateByUrl('/notes', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/notes']);     });
      }

    }, err => {
      this.snackBar.open('Failed to remove note', null, {
        duration: 2000,
      });
    });
    }

  restore() {
    this.noteService.editDraftField(this.note._id, true).subscribe(noteID => {
      this.snackBar.open('', null, {
        duration: 0,
      });
      console.log('Edit draft to true in restore process');

    }, err => {
      this.snackBar.open('Failed to restore note', null, {
        duration: 2000,
      });

    });


    this.noteService.editToDeleteField(this.note._id, false).subscribe(noteID => {
        this.snackBar.open('Restored Note ', null, {
          duration: 2000,
        });
        console.log('Edit toDelete to false in restore process');
        // This "hack" may not be good form, but it is the only thing I was able to understand and
        // apply. It is much better than location.reload(), but not as good as using an event emitter (which I tried, but failed at)
        if (this.note.reuse === true) {
        this.router.navigateByUrl('/notes', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/notes/reuse']);
      });   } else {
        this.router.navigateByUrl('/notes', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/notes/draft']);
      });   }
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
        this.router.navigate(['/notes']);
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
