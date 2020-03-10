import { Component, OnInit, Input } from '@angular/core';
import { Note } from './note';

// Components
@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit {

  @Input() note: Note;
  @Input() simple ? = false;

  constructor() { }

  ngOnInit(): void {
  }

}
