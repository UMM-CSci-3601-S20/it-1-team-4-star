import { Component, OnInit, OnDestroy } from '@angular/core';
import { Note } from './note';
import { NoteService } from './note.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-note-list-component',
  templateUrl: 'note-list.component.html',
  styleUrls: ['./note-list.component.scss'],
  providers: []
})

export class NoteListComponent implements OnInit, OnDestroy  {
  // These are public so that tests can reference them (.spec.ts)
  public serverFilteredNotes: Note[];
  public filteredNotes: Note[];
  public body: string;
  public addDate: Date;
  public expirationDate: Date;
  public creator: string;
  public reusable: boolean;
  public draft: boolean;
  public toDelete: boolean;
  public viewType: 'card' | 'list' = 'card';
  getNotesSub: Subscription;


  // Inject the NoteService into this component.
  // That's what happens in the following constructor.
  //
  // We can call upon the service for interacting
  // with the server.

  constructor(private noteService: NoteService) {

  }

  getNotesFromServer(): void {
    this.unsub();
    this.getNotesSub = this.noteService.getNotes({
      creator: this.creator
    }).subscribe(returnedNotes => {
      this.serverFilteredNotes = returnedNotes;
      this.updateFilter();
    }, err => {
      console.log(err);
    });
  }

  public updateFilter(): void {
    this.filteredNotes = this.noteService.filterNotes(
      this.serverFilteredNotes, {body: this.body, addDate: this.addDate, expirationDate: this.expirationDate, reusable: this.reusable, draft: this.draft, toDelete: this.toDelete });
  }

  /**
   * Starts an asynchronous operation to update the notes list
   *
   */
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
