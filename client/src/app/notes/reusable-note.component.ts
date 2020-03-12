import { Component, OnInit, OnDestroy } from '@angular/core';
import { Note } from './note';
import { NoteService } from './note.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reusable-note.component',
  templateUrl: 'reusable-note.component.html',
  styleUrls: ['./reusable-note.component.scss'],
  providers: []
})
export class ReusableNoteComponent implements OnInit, OnDestroy  {
  // These are public so that tests can reference them (.spec.ts)
  public serverFilteredNotes: Note[];
  public filteredNotes: Note[];
  owner: string;
  public body: string;
  public reusable: boolean;
  public draft: boolean;
  public toDelete: boolean;
  public viewType: 'card' | 'list' = 'card';
  getReusableNotesSub: Subscription;

  // Inject the NoteService into this component.
  // That's what happens in the following constructor.
  //
  // We can call upon the service for interacting
  // with the server.
  constructor(private noteService: NoteService) {

  }

  getReusableNotesFromServer(): void {
    this.unsub();
    this.getReusableNotesSub = this.noteService.getReusableNotes({
      owner: this.owner
    }).subscribe(returnedNotes => {
      this.serverFilteredNotes = returnedNotes;
      this.updateFilter();
    }, err => {
      console.log(err);
    });
  }

  public updateFilter(): void {
    this.filteredNotes = this.noteService.filterNotes(
      this.serverFilteredNotes, {body: this.body, reusable: this.reusable, draft: this.draft, toDelete: this.toDelete });
  }

  /**
   * Starts an asynchronous operation to update the notes list
   *
   */
  ngOnInit(): void {
    this.getReusableNotesFromServer();
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  unsub(): void {
    if (this.getReusableNotesSub) {
      this.getReusableNotesSub.unsubscribe();
    }
  }
}
