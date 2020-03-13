import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Note } from './note';
import { map } from 'rxjs/operators';

@Injectable()
export class NoteService {
  readonly noteUrl: string = environment.API_URL + 'notes';

  constructor(private httpClient: HttpClient) {
  }

  getNotes(filters?: { body?: string, reuse?: boolean, draft?: boolean, toDelete?: boolean }): Observable<Note[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.body) {
        httpParams = httpParams.set('body', filters.body);
      }
      if (filters.reuse) {
        httpParams = httpParams.set('reuse', filters.reuse.toString());
      }
      if (filters.draft) {
        httpParams = httpParams.set('draft', filters.draft.toString());
      }
      if (filters.toDelete) {
        httpParams = httpParams.set('toDelete', filters.toDelete.toString());
      }
    }

    return this.httpClient.get<Note[]>(this.noteUrl, {
      params: httpParams,
    });
  }

  getNoteById(id: string): Observable<Note> {
    return this.httpClient.get<Note>(this.noteUrl + '/' + id);
  }

  filterNotes(notes: Note[], filters: {
    body?: string, reuse?: boolean, draft?: boolean, toDelete?: boolean
  }): Note[] {
    // taking this out of filter notes
    // addDate?: Date, expirationDate?: Date

    // Filter by body
    if (filters.body) {
      console.log('body');
      filters.body = filters.body.toLowerCase();
      notes = notes.filter(note => {
        return note.body.toLowerCase().indexOf(filters.body) !== -1;
      });
    }

    // Filter by reuse
    if (filters.reuse === true) {
      console.log('reuse true');
      notes = notes.filter(note => {
        return note.reuse.valueOf() === true;
      });
    }
    if (filters.toDelete === false) {
      console.log('toDelete false');
      notes = notes.filter(note => {
        return note.toDelete.valueOf() === false;
      });
    }
    if (filters.reuse === false) {
      console.log('reuse false');
      notes = notes.filter(note => {
        return note.reuse.valueOf() === false;
      });
    }

    // Filter by draft
    if (filters.draft === true) {
      console.log('draft true');

      notes = notes.filter(note => {
        return note.draft.valueOf() === true;
      });
    }

    if (filters.draft === false) {
      console.log('draft false');

      notes =  notes.filter(note => {
        return note.draft.valueOf() === false;
      });
    }

    // Filter by toDelete
    if (filters.toDelete === true) {
      console.log('toDelete true');

      notes = notes.filter(note => {
        return note.toDelete.valueOf() === true;
      });
    }



    return notes;
  }


  addNote(newNote: Note): Observable<string> {
    // Send post request to add a new note with the note data as the body.
    return this.httpClient.post<{ id: string }>(this.noteUrl + '/new', newNote).pipe(map(res => res.id));
  }

  deleteNote(id: string): Observable<Note> {
    return this.httpClient.delete<Note>(this.noteUrl + '/' + id);
  }


  editDraftField(id: string, value: boolean): Observable<Note> {
    return this.httpClient.patch<Note>('api/notes/' + id + '/editDraftField', { 'draft': value });
  }


  editToDeleteField(id: string, value: boolean): Observable<Note> {
    return this.httpClient.patch<Note>('api/notes/' + id + '/editToDeleteField', { 'toDelete': value });
  }

  editReuseField(id: string, value: boolean): Observable<Note> {
    return this.httpClient.patch<Note>('api/notes/' + id + '/editReuseField', { 'reuse': value });
  }


}
