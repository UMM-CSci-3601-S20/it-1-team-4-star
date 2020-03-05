import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User } from './user';
import { UserService } from './user.service';

describe('User service: ', () => {
  // A small collection of test users
  const testUsers: User[] = [
    {
      userId: 'rachel_id',
      name: 'Rachel Johnson',
      email: 'rmjohns@morris.umn.edu',
      building: 'science',
      officeNumber: '123'

    },
    {
      userId: 'nic_id',
      name: 'Nic',
      email: 'mcphee@morris.umn.edu',
      building: 'science',
      officeNumber: '456'
    },
    {
      userId: 'joe_id',
      name: 'Joe',
      email: 'jbeaver@morris.umn.edu',
      building: 'imholte',
      officeNumber: '789'
    }
  ];
  let userService: UserService;
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
    userService = new UserService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getUsers() calls api/users', () => {
    // Assert that the users we get from this call to getUsers()
    // should be our set of test users. Because we're subscribing
    // to the result of getUsers(), this won't actually get
    // checked until the mocked HTTP request 'returns' a response.
    // This happens when we call req.flush(testUsers) a few lines
    // down.
    userService.getUsers().subscribe(
      users => expect(users).toBe(testUsers)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(userService.userUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testUsers);
  });

  it('getUsers() calls api/users with filter parameter \'name\'', () => {

    userService.getUsers({ name: 'Rachel Johnson' }).subscribe(
      users => expect(users).toBe(testUsers)
    );

    // Specify that (exactly) one request will be made to the specified URL with the role parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(userService.userUrl) && request.params.has('name')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the role parameter was 'admin'
    expect(req.request.params.get('name')).toEqual('Rachel Johnson');

    req.flush(testUsers);
  });

  it('getUsers() calls api/users with filter parameter \'building\'', () => {

    userService.getUsers({ building: 'science' }).subscribe(
      users => expect(users).toBe(testUsers)
    );

    // Specify that (exactly) one request will be made to the specified URL with the building parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(userService.userUrl) && request.params.has('building')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the role parameter was 'admin'
    expect(req.request.params.get('building')).toEqual('science');

    req.flush(testUsers);
  });

  it('getUsers() calls api/users with multiple filter parameters', () => {

    userService.getUsers({ name: 'Joe Beaver', building: 'imholte' }).subscribe(
      users => expect(users).toBe(testUsers)
    );

    // Specify that (exactly) one request will be made to the specified URL with the role parameter.
    const req = httpTestingController.expectOne(
      (request) => request.url.startsWith(userService.userUrl)
        && request.params.has('name') && request.params.has('building')
    );

    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');

    // Check that the role parameters are correct
    expect(req.request.params.get('name')).toEqual('Joe Beaver');
    expect(req.request.params.get('building')).toEqual('imholte');

    req.flush(testUsers);
  });

  it('getUserById() calls api/users/id', () => {
    const targetUser: User = testUsers[1];
    const targetId: string = targetUser.userId;
    userService.getUserById(targetId).subscribe(
      user => expect(user).toBe(targetUser)
    );

    const expectedUrl: string = userService.userUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetUser);
  });

  it('filterUsers() filters by email', () => {
    expect(testUsers.length).toBe(3);
    const userEmail = 'j';
    expect(userService.filterUsers(testUsers, { email: userEmail }).length).toBe(2);
  });

  it('filterUsers() filters by office number', () => {
    expect(testUsers.length).toBe(3);
    const userOfficeNumber = '789';
    expect(userService.filterUsers(testUsers, { officeNumber: userOfficeNumber }).length).toBe(1);
  });

  it('filterUsers() filters by email and office number', () => {
    expect(testUsers.length).toBe(3);
    const userOfficeNumber = '789';
    const userEmail = 'jbeaver@morris.umn.edu';
    expect(userService.filterUsers(testUsers, { email: userEmail, officeNumber: userOfficeNumber }).length).toBe(1);
  });

  it('addUser() calls api/users/new', () => {

    userService.addUser(testUsers[1]).subscribe(
      id => expect(id).toBe('testid')
    );

    const req = httpTestingController.expectOne(userService.userUrl + '/new');

    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(testUsers[1]);

    req.flush({id: 'testid'});
  });
});
