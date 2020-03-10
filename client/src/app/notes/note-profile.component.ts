import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Note } from './note';
import { NoteService } from './note.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-note-profile',
  templateUrl: './note-profile.component.html',
  styleUrls: ['./note-profile.component.scss']
})
export class NoteProfileComponent implements OnInit, OnDestroy {

  constructor(private route: ActivatedRoute, private noteService: NoteService) { }

  note: Note;
  id: string;
  getNoteSub: Subscription;

  ngOnInit(): void {
    // We subscribe to the parameter map here so we'll be notified whenever
    // that changes (i.e., when the URL changes) so this component will update
    // to display the newly requested note.
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      if (this.getNoteSub) {
        this.getNoteSub.unsubscribe();
      }
      this.getNoteSub = this.noteService.getNoteById(this.id).subscribe(note => this.note = note);
    });
  }

  ngOnDestroy(): void {
    if (this.getNoteSub) {
      this.getNoteSub.unsubscribe();
    }
  }

}
