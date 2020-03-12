import {Component} from '@angular/core';
import { Note } from '../notes/note';
import { NoteService } from '../notes/note.service';
import { NoteListComponent } from '../notes/note-list.component';
import { NoteCardComponent } from '../notes/note-card.component';

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
  public body: string;
  public addDate: Date;
  public reuse: boolean;
  public draft: boolean;
  public toDelete: boolean;
  public viewType: 'card' | 'list' = 'card';
  //getNotesSub: Subscription;

  ownerId: string;

  constructor(private noteService: NoteService) {
  }
  public updateFilter(): void {
    this.filteredNotes = this.noteService.filterNotes(
      this.serverFilteredNotes, {body: this.body, reuse: this.reuse, draft: this.draft, toDelete: this.toDelete });
  }

}
