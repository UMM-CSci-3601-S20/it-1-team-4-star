import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Note, reusable, draft, toDelete } from './note';
import { NoteService } from './note.service';
import { ɵɵresolveBody } from '@angular/core';

let date: Date = new Date();
console.log("Date= " + date);

let date2: Date = new Date();
console.log("Date= " + date2 + 1);

describe('Note service: ', () => {
  // A small collection of test notes
  const testNotes: Note[] = [
    {
      _id: '4126554g28628d3hefr33de3d',
      owner:'Rachel Johnson',
      body: 'Kid sick, study hard',
      // addDate: date,
      // expirationDate: date2,
      draft: true,
      reusable: false,
      toDelete: true
    },
    {
      _id: '1233211w32122v3etfd88c8d',
      owner: 'Joe Beaver',
      body: 'cookie wuz hear',
      // addDate: date,
      // expirationDate: date2,
      draft: false,
      reusable: true,
      toDelete: false
    },
    {
      _id: '4444444a55555s6dddd77f8g',
      owner: 'Nic McPhee',
      body: 'Rawr, I need some sleep',
      // addDate: date,
      // expirationDate: date2,
      draft: false,
      reusable: true,
      toDelete: false
    }
  ];
  let noteService: NoteService;
  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    noteService = new NoteService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getNotes() calls api/notes', () => {
    // Assert that the notes we get from this call to getNotes()
    // should be our set of test notes. Because we're subscribing
    // to the result of getNotes(), this won't actually get
    // checked until the mocked HTTP request 'returns' a response.
    // This happens when we call req.flush(testNotes) a few lines
    // down.
    noteService.getNotes().subscribe(
      notes => expect(notes).toBe(testNotes)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(noteService.noteUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testNotes);
  });

  it('getNotes() calls api/notes with filter parameter \'reusable\'', () => {

    noteService.getNotes({ reusable: 'true' }).subscribe(
      notes => expect(notes).toBe(testNotes)
    );

    // Specify that (exactly) one request will be made to the specified URL with the reusable parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(noteService.noteUrl) && request.params.has('reusable')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the boolean value was 'true'
    expect(req.request.params.get('reusable')).toEqual('true');

    req.flush(testNotes);
  });

  it('getNotes() calls api/notes with filter parameter \'draft\'', () => {

    noteService.getNotes({ draft: 'true' }).subscribe(
      notes => expect(notes).toBe(testNotes)
    );

    // Specify that (exactly) one request will be made to the specified URL with the role parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(noteService.noteUrl) && request.params.has('draft')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the boolean value was 'true'
    expect(req.request.params.get('draft')).toEqual('true');

    req.flush(testNotes);
  });

  it('getNotes() calls api/notes with filter parameter \'toDelete\'', () => {

    noteService.getNotes({ toDelete: 'true' }).subscribe(
      notes => expect(notes).toBe(testNotes)
    );

    // Specify that (exactly) one request will be made to the specified URL with the role parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(noteService.noteUrl) && request.params.has('toDelete')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the boolean value was 'true'
    expect(req.request.params.get('toDelete')).toEqual('true');

    req.flush(testNotes);
  });


  it('getNoteById() calls api/notes/id', () => {
    const targetNote: Note = testNotes[1];
    const targetId: string = targetNote._id;
    noteService.getNoteById(targetId).subscribe(
      note => expect(note).toBe(targetNote)
    );

    const expectedUrl: string = noteService.noteUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetNote);
  });

  it('filterNotes() filters by body', () => {
    expect(testNotes.length).toBe(3);
    const noteBody = 'cook';
    expect(noteService.filterNotes(testNotes, { body: noteBody }).length).toBe(1);
  });

  it('filterNotes() filters by owner', () => {
    expect(testNotes.length).toBe(3);
    const noteOwner = 'Rachel Johnson';
    expect(noteService.filterNotes(testNotes, { owner: noteOwner }).length).toBe(1);
  });

  it('addNote() calls api/notes/new', () => {

    noteService.addNote(testNotes[1]).subscribe(
      id => expect(id).toBe('testid')
    );

    const req = httpTestingController.expectOne(noteService.noteUrl + '/new');

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(testNotes[1]);

    req.flush({id: 'testid'});
  });
});
