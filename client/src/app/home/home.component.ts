import {Component} from '@angular/core';
import { Note, reusable, draft, toDelete } from '../notes/note';
import { NoteService } from '../notes/note.service';
import { NoteListComponent } from '../notes/note-list.component';
import { NoteCardComponent } from '../notes/note-card.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-component',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: []
})
export class HomeComponent {

  // These are public so that tests can reference them (.spec.ts)
  public serverFilteredNotes: Note[];
  public filteredNotes: Note[];
  //public owner: string;
  public body: string;
  //public addDate: Date;
  // public expirationDate: Date;
  // public owner: string;
  public reusable: reusable;
  public draft: draft;
  public toDelete: toDelete;
  public viewType: 'card' | 'list' = 'card';
  getNotesSub: Subscription;

  //ownerId: string;

  constructor(private noteService: NoteService) {
  }

  getNotesFromServer(): void {
    this.unsub();
    this.getNotesSub = this.noteService.getNotes({
      reusable: this.reusable,
      draft: this.draft,
      toDelete: this.toDelete
    }).subscribe(returnedNotes => {
      this.serverFilteredNotes = returnedNotes;
      this.updateFilter();
    }, err => {
      console.log(err);
    });
  }
  public updateFilter(): void {
    this.filteredNotes = this.noteService.filterNotes(
      this.serverFilteredNotes, {body: this.body });
  }

  ngOnInit(): void {
    this.getNotesFromServer();
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  unsub(): void {
    if (this.getNotesSub) {
      this.getNotesSub.unsubscribe();
    }
  }
}
