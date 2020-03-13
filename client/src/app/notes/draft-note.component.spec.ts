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
import { Note } from './note';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NoteCardComponent } from './note-card.component';
import { DraftNoteComponent } from './draft-note.component';
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
  FormsModule,
];

describe('Draft note', () => {

  let draftNote: DraftNoteComponent;
  let fixture: ComponentFixture<DraftNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [DraftNoteComponent, NoteCardComponent],
      // providers:    [ NoteService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: NoteService, useValue: new MockNoteService() }, FormBuilder, MatSnackBar ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DraftNoteComponent);
      draftNote = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  // these test from the mock note service

  it('contains all the draft notes', () => {
    expect(draftNote.serverFilteredNotes.length).toBe(3);
  });

  it('contains a draft note with the text \'ducks go quack\'', () => {
    expect(draftNote.serverFilteredNotes.some((note: Note) => note.body === 'ducks go quack')).toBe(true);
  });

  it('contain a draft note with field toDelete \'true\'', () => {
    expect(draftNote.serverFilteredNotes.some((note: Note) => note.toDelete === true)).toBe(true);
  });

  it('contain a draft note with field reuse \'false\'', () => {
    expect(draftNote.serverFilteredNotes.some((note: Note) => note.reuse === false)).toBe(true);
  });

  it('contain a draft note with field draft \'true\'', () => {
    expect(draftNote.serverFilteredNotes.some((note: Note) => note.draft === true)).toBe(true);
  });

});

describe('Misbehaving Draft Note', () => {
  let draftNote: DraftNoteComponent;
  let fixture: ComponentFixture<DraftNoteComponent>;

  let noteServiceStub: {
    getDraftNotes: () => Observable<Note[]>;
    getDraftNotesFiltered: () => Observable<Note[]>;
  };

  beforeEach(() => {
    // stub NoteService for test purposes
    noteServiceStub = {
      getDraftNotes: () => new Observable(observer => {
        observer.error('Error-prone observable');
      }),
      getDraftNotesFiltered: () => new Observable(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [DraftNoteComponent],
      // providers:    [ NoteService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: NoteService, useValue: noteServiceStub }]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DraftNoteComponent);
      draftNote = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

});
