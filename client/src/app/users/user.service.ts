import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './user';
import { map } from 'rxjs/operators';

@Injectable()
export class UserService {
  readonly userUrl: string = environment.API_URL + 'users';

  constructor(private httpClient: HttpClient) {
  }



  getUsers(filters?: { name?: string, building?: string }): Observable<User[]> {
    let httpParams: HttpParams = new HttpParams();
    if (filters) {
      if (filters.name) {
        httpParams = httpParams.set('name', filters.name);
      }
      if (filters.building) {
        httpParams = httpParams.set('building', filters.building);
      }
    }
    return this.httpClient.get<User[]>(this.userUrl, {
      params: httpParams,
    });
  }

  getUserById(_id: string): Observable<User> {
    return this.httpClient.get<User>(this.userUrl + '/' + _id);
  }

  //FILTERING EVERYTHING WITH ANGULAR

  filterUsers(users: User[], filters: { name?: string, building?: string, email?: string, officeNumber?: string }): User[] {

    let filteredUsers = users;

    // Filter by office number
    if (filters.officeNumber) {
      filters.officeNumber = filters.officeNumber.toLowerCase();

      filteredUsers = filteredUsers.filter(user => {
        return user.officeNumber.toLowerCase().indexOf(filters.officeNumber) !== -1;
      });
    }

    // Filter by email
    if (filters.email) {
      filters.email = filters.email.toLowerCase();

      filteredUsers = filteredUsers.filter(user => {
        return user.email.toLowerCase().indexOf(filters.email) !== -1;
      });
    }

    // Filter by building
    if (filters.building) {
      filters.building = filters.building.toLowerCase();

      filteredUsers = filteredUsers.filter(user => {
        return user.building.toLowerCase().indexOf(filters.building) !== -1;
      });
    }

    // Filter by name
    if (filters.name) {
      filters.name = filters.name.toLowerCase();

      filteredUsers = filteredUsers.filter(user => {
        return user.name.toLowerCase().indexOf(filters.name) !== -1;
      });
    }

    return filteredUsers;
  }

  addUser(newUser: User): Observable<string> {
    // Send post request to add a new user with the user data as the body.
    return this.httpClient.post<{id: string}>(this.userUrl + '/new', newUser).pipe(map(res => res.id));
  }
}
