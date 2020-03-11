import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../app/users/user';
import { UserService } from '../app/users/user.service';

/**
 * A "mock" version of the `UserService` that can be used to test components
 * without having to create an actual service.
 */
@Injectable()
export class MockUserService extends UserService {
  static testUsers: User[] = [
    {
      _id: 'exampleID_1',
      name: 'Rachel Johnson',
      email: 'a@this.school',
      building: 'Science',
      officeNumber: '27',
    },

    {
      _id: 'exampleID_2',
      name: 'Nic McPhee',
      email: 'b@this.school',
      building: 'Humanities',
      officeNumber: '120',
    },

    {
      _id: 'exampleID_3',
      name: 'Professor C',
      email: 'c@this.school',
      building: 'Science',
      officeNumber: '45',
    }
  ];

  constructor() {
    super(null);
  }

  getUsers(filters: { name?: string, email?: string, building?: string, officeNumber?: string }): Observable<User[]> {
    // Just return the test users regardless of what filters are passed in
    return of(MockUserService.testUsers);
  }

  getUserById(id: string): Observable<User> {
    // If the specified ID is for the first test user,
    // return that user, otherwise return `null` so
    // we can test illegal user requests.
    if (id === MockUserService.testUsers[0]._id) {
      return of(MockUserService.testUsers[0]);
    } else {
      return of(null);
    }
  }

}
