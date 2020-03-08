import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteCardComponent } from './note-card.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';


/*
var date = new Date();
console.log(date);

var json = JSON.stringify(date);
console.log(json);
*/

//ADDS THE CURRENT DATE AND TIME
let date: Date = new Date();
console.log("Date = " + date); //Date = Tue Feb 05 2019 12:05:22 GMT+0530 (IST)

//FUTURE DATE-NOT ENTIRELY SURE IF THIS WORKS
var futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 1);

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
      creator: 'Rachel Johnson',
      body: 'this is a sample note',
      expirationDate: futureDate,
      addDate: date,
      reusable: true,
      toDelete: false
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
