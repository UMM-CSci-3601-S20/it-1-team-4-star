import { Component, OnInit, OnDestroy } from '@angular/core';
import { Note } from './note';
import { NoteService } from './note.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-deleted-note-list-component',
  templateUrl: 'deleted-note.component.html',
  styleUrls: ['./deleted-note.component.scss'],
  providers: []
})

export class DeletedNoteComponent implements OnInit, OnDestroy  {
  // These are public so that tests can reference them (.spec.ts)
  public serverFilteredNotes: Note[];
  public filteredNotes: Note[];
  public body: string;
  public reusable: boolean;
  public draft: boolean;
  public toDelete: boolean;
  public viewType: 'card' | 'list' = 'card';
  getDeletedNotesSub: Subscription;

  // Inject the NoteService into this component.
  // That's what happens in the following constructor.
  //
  // We can call upon the service for interacting
  // with the server.
  constructor(private noteService: NoteService) {

  }

  getDeletedNotesFromServer(): void {
    this.unsub();
    this.getDeletedNotesSub = this.noteService.getNotes({
      body: this.body
    }).subscribe(returnedNotes => {
      this.serverFilteredNotes = returnedNotes;
      this.updateFilter();
    }, err => {
      console.log(err);
    });
  }
  public updateFilter(): void {
    this.filteredNotes = this.noteService.filterNotes(
      this.serverFilteredNotes, {body: this.body, reuse: this.reusable, draft: this.draft, toDelete: this.toDelete });
  }
  /**
   * Starts an asynchronous operation to update the notes list
   *
   */
  ngOnInit(): void {
    this.getDeletedNotesFromServer();
  }
  ngOnDestroy(): void {
    this.unsub();
  }
  unsub(): void {
    if (this.getDeletedNotesSub) {
      this.getDeletedNotesSub.unsubscribe();
    }
  }
}
