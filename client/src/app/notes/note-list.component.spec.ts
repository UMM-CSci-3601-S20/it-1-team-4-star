import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Note } from './note';

import { NoteCardComponent } from './note-card.component';
import { NoteListComponent } from './note-list.component';
import { NoteService } from './note.service';
import { MatIconModule } from '@angular/material/icon';


const COMMON_IMPORTS: any[] = [
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatSelectModule,
  MatOptionModule,
  MatButtonModule,
  MatInputModule,
  MatExpansionModule,
  MatTooltipModule,
  MatListModule,
  MatDividerModule,
  MatRadioModule,
  MatIconModule,
  BrowserAnimationsModule,
  RouterTestingModule,
  RouterTestingModule,
  ReactiveFormsModule,
  FormsModule,
];

describe('Note list', () => {

  let noteList: NoteListComponent;
  let fixture: ComponentFixture<NoteListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [NoteListComponent, NoteCardComponent],
      // providers:    [ NoteService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: NoteService, useValue: new MockNoteService() }, FormBuilder, MatSnackBar ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(NoteListComponent);
      noteList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  //these test from the mock note service

  it('contains all the notes', () => {
    console.log('Contains all the notes: \n');
    console.log(noteList.serverFilteredNotes.length);
    expect(noteList.serverFilteredNotes.length).toBe(3);
  });

  it('contains a note with \'ducks go quack\'', () => {
    expect(noteList.serverFilteredNotes.some((note: Note) => note.body === 'ducks go quack')).toBe(true);
  });

  it('contain a note with field toDelete \'true\'', () => {
    expect(noteList.serverFilteredNotes.some((note: Note) => note.toDelete === true)).toBe(true);
  });

  it('contain a note with field reuse \'false\'', () => {
    expect(noteList.serverFilteredNotes.some((note: Note) => note.reuse === false)).toBe(true);
  });

  it('contain a note with field draft \'true\'', () => {
    expect(noteList.serverFilteredNotes.some((note: Note) => note.draft === true)).toBe(true);
  });

});

describe('Misbehaving Note List', () => {
  let noteList: NoteListComponent;
  let fixture: ComponentFixture<NoteListComponent>;

  let noteServiceStub: {
    getNotes: () => Observable<Note[]>;
    getNotesFiltered: () => Observable<Note[]>;
  };

  beforeEach(() => {
    // stub NoteService for test purposes
    noteServiceStub = {
      getNotes: () => new Observable(observer => {
        observer.error('Error-prone observable');
      }),
      getNotesFiltered: () => new Observable(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [NoteListComponent],
      // providers:    [ NoteService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: NoteService, useValue: noteServiceStub }]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(NoteListComponent);
      noteList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a NoteListService', () => {
    // Since the observer throws an error, we don't expect notes to be defined.
    expect(noteList.serverFilteredNotes).toBeUndefined();
  });
});
