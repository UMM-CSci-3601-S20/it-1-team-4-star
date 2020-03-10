import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRouteStub } from '../../testing/activated-route-stub';
import { MockNoteService } from '../../testing/note.service.mock';
import { Note } from './note';
import { NoteCardComponent } from './note-card.component';
import { NoteProfileComponent } from './note-profile.component';
import { NoteService } from './note.service';

describe('NoteProfileComponent', () => {
  let component: NoteProfileComponent;
  let fixture: ComponentFixture<NoteProfileComponent>;
  const activatedRoute: ActivatedRouteStub = new ActivatedRouteStub();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatCardModule
      ],
      declarations: [NoteProfileComponent, NoteCardComponent],
      providers: [
        { provide: NoteService, useValue: new MockNoteService() },
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to a specific note profile', () => {
    const expectedNote: Note = MockNoteService.testNotes[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `NoteProfileComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedNote._id });

    expect(component.id).toEqual(expectedNote._id);
    expect(component.note).toEqual(expectedNote);
  });

  it('should navigate to correct note when the id parameter changes', () => {
    let expectedNote: Note = MockNoteService.testNotes[0];
    // Setting this should cause anyone subscribing to the paramMap
    // to update. Our `NoteProfileComponent` subscribes to that, so
    // it should update right away.
    activatedRoute.setParamMap({ id: expectedNote._id });

    expect(component.id).toEqual(expectedNote._id);

    // Changing the paramMap should update the displayed note profile.
    expectedNote = MockNoteService.testNotes[1];
    activatedRoute.setParamMap({ id: expectedNote._id });

    expect(component.id).toEqual(expectedNote._id);
  });

  it('should have `null` for the note for a bad ID', () => {
    activatedRoute.setParamMap({ id: 'badID' });

    // If the given ID doesn't map to a note, we expect the service
    // to return `null`, so we would expect the component's note
    // to also be `null`.
    expect(component.id).toEqual('badID');
    expect(component.note).toBeNull();
  });
});
