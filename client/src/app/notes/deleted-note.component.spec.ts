import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
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

import { NoteCardComponent } from './note-card.component';
import { DeletedNoteComponent } from './deleted-note.component';
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

describe('Deleted note', () => {

  let deletedNote: DeletedNoteComponent;
  let fixture: ComponentFixture<DeletedNoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [DeletedNoteComponent, NoteCardComponent],
      // providers:    [ NoteService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: NoteService, useValue: new MockNoteService() }]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DeletedNoteComponent);
      deletedNote = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  // these test from the mock note service

  it('contains all the deleted notes', () => {
    expect(deletedNote.serverFilteredNotes.length).toBe(3);
  });

  it('contains a deleted note owner with the name \'Rachel Johnson\'', () => {
    expect(deletedNote.serverFilteredNotes.some((note: Note) => note.owner === 'Rachel Johnson')).toBe(true);
  });

  it('contains a deleted note owner with the name \'Nic McPhee\'', () => {
    expect(deletedNote.serverFilteredNotes.some((note: Note) => note.owner === 'Nic McPhee')).toBe(true);
  });

  it('doesn\'t contain a deleted note named \'John Cena\'', () => {
    expect(deletedNote.serverFilteredNotes.some((note: Note) => note.owner === 'John Cena')).toBe(false);
  });

  /* it('has two notes that are in the same building', () => {
    expect(deletedNote.serverFilteredNotes.filter((note: Note) => note.body === 'Science').length).toBe(2);
  }); */
});

describe('Misbehaving Deleted Note', () => {
  let deletedNote: DeletedNoteComponent;
  let fixture: ComponentFixture<DeletedNoteComponent>;

  let noteServiceStub: {
    getDeletedNotes: () => Observable<Note[]>;
    getDeletedNotesFiltered: () => Observable<Note[]>;
  };

  beforeEach(() => {
    // stub NoteService for test purposes
    noteServiceStub = {
      getDeletedNotes: () => new Observable(observer => {
        observer.error('Error-prone observable');
      }),
      getDeletedNotesFiltered: () => new Observable(observer => {
        observer.error('Error-prone observable');
      })
    };

    TestBed.configureTestingModule({
      imports: [COMMON_IMPORTS],
      declarations: [DeletedNoteComponent],
      // providers:    [ NoteService ]  // NO! Don't provide the real service!
      // Provide a test-double instead
      providers: [{ provide: NoteService, useValue: noteServiceStub }]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DeletedNoteComponent);
      deletedNote = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('generates an error if we don\'t set up a DeletedNoteService', () => {
    // Since the observer throws an error, we don't expect notes to be defined.
    expect(deletedNote.serverFilteredNotes).toBeUndefined();
  });
});
