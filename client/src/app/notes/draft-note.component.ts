import { Component, OnInit, OnDestroy } from '@angular/core';
import { Note } from './note';
import { NoteService } from './note.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'draft-note.component',
  templateUrl: 'draft-note.component.html',
  styleUrls: ['./draft-note.component.scss'],
  providers: []
})

export class DraftNoteComponent implements OnInit, OnDestroy  {
  // These are public so that tests can reference them (.spec.ts)
  public serverFilteredNotes: Note[];
  public filteredNotes: Note[];
  public body: string;
  public reuse = false;
  public draft = true;
  public toDelete = false;
  getDraftNotesSub: Subscription;


  // Inject the NoteService into this component.
  // That's what happens in the following constructor.
  //
  // We can call upon the service for interacting
  // with the server.

  constructor(private noteService: NoteService) {

  }

  getDraftNotesFromServer(): void {
    this.unsub();
    this.getDraftNotesSub = this.noteService.getNotes({
      body: this.body,
      reuse: this.reuse,
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
      this.serverFilteredNotes, {body: this.body, reuse: this.reuse, draft: this.draft, toDelete: this.toDelete});
  }

  /**
   * Starts an asynchronous operation to update the notes reuse
   *
   */
  ngOnInit(): void {
    this.getDraftNotesFromServer();
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  unsub(): void {
    if (this.getDraftNotesSub) {
      this.getDraftNotesSub.unsubscribe();
    }
  }
}
