import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Note } from '../app/notes/note';
import { NoteService } from '../app/notes/note.service';

/**
 * A "mock" version of the `NoteService` that can be used to test components
 * without having to create an actual service.
 */

/*let date: Date = new Date();
console.log("Date= " + date);

let date2: Date = new Date();
console.log("Date= " + date2 + 1);

let date3: Date = new Date();
console.log("Date= " + date3 + 1);*/

@Injectable()
export class MockNoteService extends NoteService {
  static testNotes: Note[] = [
    {
      _id: '4126554g28628d3hefr33de3d',
      owner:'588935f57546a2daea44de7c',
      body: 'ducks go quack',
      // addDate: date,
      // expirationDate: date2,
      draft: true,
      reusable: false,
      toDelete: true
    },
    {
      _id: '1233211w32122v3etfd88c8d',
      owner: 'Juana',
      body: 'cookie wuz hear',
      // addDate: date,
      // expirationDate: date2,
      draft: false,
      reusable: true,
      toDelete: false
    },
    {
      _id: '4444444a55555s6dddd77f8g',
      owner: '588935f5556f992bf8f37c01',
      body: 'cookie wuz hear prabubly',
      // addDate: date,
      // expirationDate: date3,
      draft: false,
      reusable: true,
      toDelete: false
    }
  ];

  constructor() {
    super(null);
  }

  getNotes(filters: { owner?: string, body?: string, reusable?: boolean, draft?: boolean, toDelete?: boolean }): Observable<Note[]> {
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
