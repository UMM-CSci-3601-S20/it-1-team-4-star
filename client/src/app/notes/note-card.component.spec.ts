import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteCardComponent } from './note-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';


describe('NoteCardComponent', () => {
  let component: NoteCardComponent;
  let fixture: ComponentFixture<NoteCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatCardModule
      ],
      declarations: [ NoteCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoteCardComponent);
    component = fixture.componentInstance;
    component.note = {
      _id: 'rachel_id',
      owner: 'Rachel Johnson',
      body: 'this is a sample note',
      // expirationDate: futureDate,
      // addDate: date,
      draft: true,
      reusable: true,
      toDelete: false
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
