import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Note, reusable, draft, toDelete } from './note';
import { map } from 'rxjs/operators';

@Injectable()
export class NoteService {
  readonly noteUrl: string = environment.API_URL + 'notes';

  constructor(private httpClient: HttpClient) {
  }

  //FILTERING BY THE SERVER
  getNotes(filters?: { reusable?: reusable, draft?: draft, toDelete?: toDelete }): Observable<Note[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.reusable) {
        httpParams = httpParams.set('reusable', filters.reusable);
      }
      if (filters.draft) {
        httpParams = httpParams.set('draft', filters.draft);
      }
      if (filters.toDelete) {
        httpParams = httpParams.set('toDelete', filters.toDelete);
      }
    }
    return this.httpClient.get<Note[]>(this.noteUrl, {
      params: httpParams,
    });
  }

  getNoteById(id: string): Observable<Note> {
    return this.httpClient.get<Note>(this.noteUrl + '/' + id);
  }

//FILTERING WITH ANGULAR
  filterNotes(notes: Note[], filters: { body?: string }): Note[] {
    // taking this out of filter notes
    // addDate?: Date, expirationDate?: Date
    let filteredNotes = notes;

    // Filter by body
    if (filters.body) {
      filters.body = filters.body.toLowerCase();

      filteredNotes = filteredNotes.filter(note => {
        return note.body.toLowerCase().indexOf(filters.body) !== -1;
      });
    }

    /*
    //Filter by owner
    if (filters.owner) {
      filters.owner = filters.owner.toLowerCase();

      filteredNotes = filteredNotes.filter(note => {
        return note.owner.toLowerCase().indexOf(filters.owner) !== -1;
      });
    }
*/

    // Kept for future iterations

    // // Filter by addDate
    // if (filters.addDate) {
    //   filters.addDate = filters.addDate;

    //   filteredNotes = filteredNotes.filter(note => {
    //     return note.addDate.toDateString().indexOf(filters.addDate.toDateString()) !== -1;
    //   });
    // }

    // // Filter by expirationDate
    // if (filters.expirationDate) {
    //   filters.expirationDate = filters.expirationDate;

    //   filteredNotes = filteredNotes.filter(note => {
    //     return note.expirationDate.toDateString().indexOf(filters.addDate.toDateString()) !== -1;
    //   });
    // }



    return filteredNotes;
  }

  addNote(newNote: Note): Observable<string> {
    // Send post request to add a new note with the note data as the body.
    return this.httpClient.post<{id: string}>(this.noteUrl + '/new', newNote).pipe(map(res => res.id));
  }
}
