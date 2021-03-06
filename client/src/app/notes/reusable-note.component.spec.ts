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
import { MockNoteService } from '../../testing/note.service.mock';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Note } from './note';

import { NoteCardComponent } from './note-card.component';
import { ReusableNoteComponent } from './reusable-note.component';
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
];

describe('Reusable Note', () => {

  let reusableNote: ReusableNoteComponent;
  let fixture: ComponentFixture<ReusableNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [ReusableNoteComponent, NoteCardComponent],
      // providers:    [ NoteService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: NoteService, useValue: new MockNoteService() }, FormBuilder, MatSnackBar]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ReusableNoteComponent);
      reusableNote = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  // these test from the mock note service

  it('contains all the reusable notes', () => {
    expect(reusableNote.serverFilteredNotes.length).toBe(3);
  });

  it('contains a note with the text \'ducks go quack\'', () => {
    expect(reusableNote.serverFilteredNotes.some((note: Note) => note.body === 'ducks go quack')).toBe(true);
  });

  it('contain a note with field toDelete \'true\'', () => {
    expect(reusableNote.serverFilteredNotes.some((note: Note) => note.toDelete === true)).toBe(true);
  });

  it('contain a note with field reuse \'false\'', () => {
    expect(reusableNote.serverFilteredNotes.some((note: Note) => note.reuse === false)).toBe(true);
  });

  it('contain a note with field draft \'true\'', () => {
    expect(reusableNote.serverFilteredNotes.some((note: Note) => note.draft === true)).toBe(true);
  });

});

describe('Misbehaving Reusable Note', () => {
  let reusableNote: ReusableNoteComponent;
  let fixture: ComponentFixture<ReusableNoteComponent>;

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
      declarations: [ReusableNoteComponent],
      // providers:    [ NoteService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: NoteService, useValue: noteServiceStub }]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ReusableNoteComponent);
      reusableNote = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a ReusableNoteService', () => {
    // Since the observer throws an error, we don't expect notes to be defined.
    expect(reusableNote.serverFilteredNotes).toBeUndefined();
  });
});
