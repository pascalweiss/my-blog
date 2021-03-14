import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { Entry } from '../common/entry';
import { EntryService } from '../services/entry.service';


@Component({
  selector: 'app-entry-nav',
  templateUrl: './entry-nav.component.html',
  styleUrls: ['./entry-nav.component.scss']
})
export class EntryNavComponent implements OnInit {
  mobileQuery: MediaQueryList;


  activeArticle: Entry;
  
  private _mobileQueryListener: () => void;
  entries: Entry[];

  constructor(private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher, private entryService: EntryService) { }

  ngOnInit() {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.entryService.getEntires().subscribe(newEntries => {
      this.entries = newEntries;
    });
    this.activeArticle = this.entries[0];
  }

  clicked(article: Entry) {
    console.log(article);
    this.activeArticle = article;
  }
}
