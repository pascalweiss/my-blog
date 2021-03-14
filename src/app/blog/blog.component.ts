import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { Entry } from '../common/entry';
import { EntryService } from '../services/entry.service';


@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  mobileQuery: MediaQueryList;


  activeArticle: String;
  
  private _mobileQueryListener: () => void;
  entries: Entry[];

  constructor(private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher, 
    private entryService: EntryService, private markdownService: MarkdownService) { }

  ngOnInit() {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.entryService.getEntires().subscribe(newEntries => {
      this.entries = newEntries;
    });
    this.activeArticle = this.mapMarkdown(this.entries[0].content);
  }

  private mapMarkdown(txt: String): String {
    return this.markdownService.compile(txt.toString());
  }

  clicked(article: Entry) {
    console.log(article);
    this.activeArticle = this.mapMarkdown(article.content);
  }
}
