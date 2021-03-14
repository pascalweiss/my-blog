import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntryNavComponent } from './entry-nav/entry-nav.component';


const routes: Routes = [
  {path: 'entry-nav', component: EntryNavComponent},
  {path: '', redirectTo: '/entry-nav', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
