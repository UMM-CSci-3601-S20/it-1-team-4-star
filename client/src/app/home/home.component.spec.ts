import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatCardModule } from '@angular/material/card';
import { NoteService } from '../notes/note.service';
import { HttpClient, HttpHandler } from '@angular/common/http';

describe('Home', () => {

  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ MatCardModule ],
      declarations: [ HomeComponent ], // declare the test component
      providers: [ NoteService, HttpClient, HttpHandler, HttpHandler ]
    });

    fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();

    component = fixture.componentInstance; // BannerComponent test instance

    // query for the link (<a> tag) by CSS element selector
    de = fixture.debugElement.query(By.css('.home-card'));
    el = de.nativeElement;
  });

  it('It has the basic home page text', () => {
    expect(el.textContent).toContain('Welcome to DoorBoard! Checkout the menu on the left to see the features.');
  });

});
