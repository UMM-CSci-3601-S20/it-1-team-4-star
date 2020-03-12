import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Note } from '../app/notes/note';
import { NoteService } from '../app/notes/note.service';

/**
 * A "mock" version of the `NoteService` that can be used to test components
 * without having to create an actual service.
 */


@Injectable()
export class MockNoteService extends NoteService {
  static testNotes: Note[] = [
    {
      _id: '4126554g28628d3hefr33de3d',
      body: 'ducks go quack',
      draft: true,
      reuse: false,
      toDelete: true
    },
    {
      _id: '1233211w32122v3etfd88c8d',
      body: 'cookie wuz hear',
      draft: false,
      reuse: true,
      toDelete: false
    },
    {
      _id: '4444444a55555s6dddd77f8g',
      body: 'cookie wuz hear prabubly',
      draft: false,
      reuse: true,
      toDelete: false
    }
  ];

  constructor() {
    super(null);
  }

  getNotes(filters: {body?: string, reuse?: boolean, draft?: boolean, toDelete?: boolean }): Observable<Note[]> {
    // Just return the test notes regardless of what filters are passed in
    return of(MockNoteService.testNotes);
  }

  getNotesById(id: string): Observable<Note> {
    // If the specified ID is for the first test note,
    // return that note, otherwise return `null` so
    // we can test illegal note requests.
    if (id === MockNoteService.testNotes[0]._id) {
      return of(MockNoteService.testNotes[0]);
    } else {
      return of(null);
    }
  }

}
