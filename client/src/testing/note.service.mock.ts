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
      owner: '588935f57546a2daea44de7c',
      body: 'ducks go quack',
      draft: true,
      reusable: false,
      toDelete: true
    },
    {
      _id: '1233211w32122v3etfd88c8d',
      owner: '588935f55b432bb2ff322160',
      body: 'cookie wuz hear',
      draft: false,
      reusable: true,
      toDelete: false
    },
    {
      _id: '4444444a55555s6dddd77f8g',
      owner: '588935f5556f992bf8f37c01',
      body: 'cookie wuz hear prabubly',
      draft: false,
      reusable: true,
      toDelete: false
    }
  ];

  constructor() {
    super(null);
  }

  getUsers(filters: { owner?: string, }): Observable<Note[]> {
    // Just return the test users regardless of what filters are passed in
    return of(MockNoteService.testNotes);
  }

  getUserById(id: string): Observable<Note> {
    // If the specified ID is for the first test user,
    // return that user, otherwise return `null` so
    // we can test illegal user requests.
    if (id === MockNoteService.testNotes[0]._id) {
      return of(MockNoteService.testNotes[0]);
    } else {
      return of(null);
    }
  }

}
