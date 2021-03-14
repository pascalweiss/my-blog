import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Entry } from '../common/entry';
import { fixture } from '../common/fixture';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  fixture: Entry[] = fixture
  
  constructor() { }

  getEntires(): Observable<Entry[]> {
    return of(this.fixture);
  }

}
