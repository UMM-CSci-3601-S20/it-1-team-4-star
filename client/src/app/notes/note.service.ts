import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Note, userID } from './note';
import { map } from 'rxjs/operators';

@Injectable()
export class NoteService {
  readonly noteUrl: string = environment.API_URL + 'notes';

  constructor(private httpClient: HttpClient) {
  }

  getNotes(filters?: { creator?: userID }): Observable<Note[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.creator) {
        httpParams = httpParams.set('creator', filters.creator);
      }
    }
    return this.httpClient.get<Note[]>(this.noteUrl, {
      params: httpParams,
    });
  }

  getNoteById(id: string): Observable<Note> {
    return this.httpClient.get<Note>(this.noteUrl + '/' + id);
  }

  filterNotes(notes: Note[], filters: { body?: string, addDate?: Date, expirationDate?: Date,
    reusable?: boolean, draft?: boolean, toDelete: boolean }): Note[] {

    let filteredNotes = notes;

    // Filter by body
    if (filters.body) {
      filters.body = filters.body.toLowerCase();

      filteredNotes = filteredNotes.filter(note => {
        return note.body.toLowerCase().indexOf(filters.body) !== -1;
      });
    }

    // Filter by addDate
    if (filters.addDate) {
      filters.addDate = filters.addDate;

      filteredNotes = filteredNotes.filter(note => {
        return note.addDate.toDateString().indexOf(filters.addDate.toDateString()) !== -1;
      });
    }

    // Filter by expirationDate
    if (filters.expirationDate) {
      filters.expirationDate = filters.expirationDate;

      filteredNotes = filteredNotes.filter(note => {
        return note.expirationDate.toDateString().indexOf(filters.addDate.toDateString()) !== -1;
      });
    }

    // Filter by reusable
    if (filters.reusable) {
       filters.reusable = filters.reusable;

       filteredNotes = filteredNotes.filter(note => {
        return note.reusable.toString().indexOf(filters.reusable.toString()) !== -1;
      });
    }

    // Filter by draft
    if (filters.draft) {
          filters.draft = filters.draft;

          filteredNotes = filteredNotes.filter(note => {
           return note.draft.toString().indexOf(filters.draft.toString()) !== -1;
         });
       }

    // Filter by toDelete
    if (filters.toDelete) {
      filters.toDelete = filters.toDelete;

      filteredNotes = filteredNotes.filter(note => {
       return note.toDelete.toString().indexOf(filters.toDelete.toString()) !== -1;
     });
   }

    return filteredNotes;
  }

  addNote(newNote: Note): Observable<string> {
    // Send post request to add a new note with the note data as the body.
    return this.httpClient.post<{id: string}>(this.noteUrl + '/new', newNote).pipe(map(res => res.id));
  }
}