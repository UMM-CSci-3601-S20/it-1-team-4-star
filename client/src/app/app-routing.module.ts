import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './users/user-list.component';
import { UserProfileComponent } from './users/user-profile.component';
import { AddUserComponent } from './users/add-user.component';
import { NoteListComponent } from './notes/note-list.component';
import { AddNoteComponent } from './notes/add-note.component';
import { DeletedNoteComponent } from './notes/deleted-note.component';
import { ReusableNoteComponent } from './notes/reusable-note.component';
import { DraftNoteComponent } from './notes/draft-note.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'users', component: UserListComponent},
  {path: 'users/new', component: AddUserComponent},
  {path: 'users/:id', component: UserProfileComponent},
  {path: 'notes', component: NoteListComponent},
  {path: 'notes/new', component: AddNoteComponent},
  {path: 'notes/deleted', component: DeletedNoteComponent},
  {path: 'notes/reuse', component: ReusableNoteComponent},
  {path: 'notes/draft', component: DraftNoteComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
