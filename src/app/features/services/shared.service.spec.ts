import { TestBed } from '@angular/core/testing';
import { SharedService } from './shared.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

describe('SharedService', () => {
  let service: SharedService;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        SharedService,
        { provide: MatSnackBar, useValue: spy }
      ]
    });

    service = TestBed.inject(SharedService);
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set loading to true', () => {
    service.setLoading(true);
    service.loading$.subscribe((isLoading) => {
      expect(isLoading).toBeTrue();
    });
  });

  it('should set loading to false', () => {
    service.setLoading(false);
    service.loading$.subscribe((isLoading) => {
      expect(isLoading).toBeFalse();
    });
  });

  it('should open snack bar with message', () => {
    const message = 'Test message';
    service.openSnackBar(message);
    expect(snackBarSpy.open).toHaveBeenCalledWith(message, '', {
      duration: 1500,
    });
  });
});
