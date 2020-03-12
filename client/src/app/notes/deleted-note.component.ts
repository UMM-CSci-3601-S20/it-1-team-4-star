import { Component, OnInit, OnDestroy } from '@angular/core';
import { Note } from './note';
import { NoteService } from './note.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'deleted-note.component',
  templateUrl: 'deleted-note.component.html',
  styleUrls: ['./deleted-note.component.scss'],
  providers: []
})

export class DeletedNoteComponent implements OnInit, OnDestroy  {
  // These are public so that tests can reference them (.spec.ts)
  public serverFilteredNotes: Note[];
  public filteredNotes: Note[];
  public body: string;
  public reuse: boolean;
  public draft: boolean;
  public toDelete: boolean;
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
      this.serverFilteredNotes, {body: this.body, reuse: this.reuse = true, draft: this.draft = true, toDelete: this.toDelete = false});
  }

  /**
   * Starts an asynchronous operation to update the notes reuse
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
