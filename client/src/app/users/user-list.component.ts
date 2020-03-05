import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from './user';
import { UserService } from './user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-list-component',
  templateUrl: 'user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: []
})

export class UserListComponent implements OnInit, OnDestroy  {
  // These are public so that tests can reference them (.spec.ts)
  public serverFilteredUsers: User[];
  public filteredUsers: User[];

  public name: string;
  public email: string;
  public building: string;
  public officeNumber: string;

  public viewType: 'card' | 'list' = 'card';
  getUsersSub: Subscription;


  // Inject the UserService into this component.
  // That's what happens in the following constructor.
  //
  // We can call upon the service for interacting
  // with the server.

  constructor(private userService: UserService) {

  }

  getUsersFromServer(): void {
    this.unsub();
    this.getUsersSub = this.userService.getUsers({
      name: this.name,
      building: this.building
    }).subscribe(returnedUsers => {
      this.serverFilteredUsers = returnedUsers;
      this.updateFilter();
    }, err => {
      console.log(err);
    });
  }

  public updateFilter(): void {
    this.filteredUsers = this.userService.filterUsers(
      this.serverFilteredUsers, { email: this.email, officeNumber: this.officeNumber });
  }

  /**
   * Starts an asynchronous operation to update the users list
   *
   */
  ngOnInit(): void {
    this.getUsersFromServer();
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  unsub(): void {
    if (this.getUsersSub) {
      this.getUsersSub.unsubscribe();
    }
  }
}
