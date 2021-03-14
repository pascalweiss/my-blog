import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntryNavComponent } from './entry-nav.component';

describe('EntryNavComponent', () => {
  let component: EntryNavComponent;
  let fixture: ComponentFixture<EntryNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntryNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
