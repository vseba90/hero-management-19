import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroComponent } from './hero.component';
import { SharedService } from '../services/shared.service';
import { TopbarComponent } from './components/topbar/topbar.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BehaviorSubject, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

describe('HeroComponent', () => {
  let component: HeroComponent;
  let fixture: ComponentFixture<HeroComponent>;
  let mockSharedService: jasmine.SpyObj<SharedService>;
  let loadingSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    loadingSubject = new BehaviorSubject<boolean>(false);
    mockSharedService = jasmine.createSpyObj(
      'SharedService',
      ['setLoading', 'openSnackBar'],
      { loading$: loadingSubject.asObservable() }
    );

    await TestBed.configureTestingModule({
      imports: [MatProgressBarModule, TopbarComponent, HeroComponent],
      providers: [
        provideRouter([]),
        { provide: SharedService, useValue: mockSharedService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the progress bar when loading$', (done) => {
    loadingSubject.next(true);
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const progressBar = fixture.debugElement.query(
        By.css('mat-progress-bar')
      );
      expect(progressBar).toBeTruthy();
      done();
    });
  });

  it('should not display the progress bar when not loading$', () => {
    loadingSubject.next(false);
    const progressBar = fixture.debugElement.query(By.css('mat-progress-bar'));
    expect(progressBar).toBeNull();
  });

  it('should render the topbar component', () => {
    const topbar = fixture.debugElement.query(By.css('app-topbar'));
    expect(topbar).toBeTruthy();
  });
});
