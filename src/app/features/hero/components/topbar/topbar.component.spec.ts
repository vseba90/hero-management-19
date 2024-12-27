import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopbarComponent } from './topbar.component';
import { By } from '@angular/platform-browser';

describe('TopbarComponent', () => {
  let component: TopbarComponent;
  let fixture: ComponentFixture<TopbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TopbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the toolbar with the title "SuperHéroes"', () => {
    const toolbarElement = fixture.debugElement.query(By.css('mat-toolbar'));
    expect(toolbarElement).toBeTruthy();
    const titleElement = toolbarElement.nativeElement.querySelector('span');
    expect(titleElement.textContent).toContain('SuperHéroes');
  });
});
