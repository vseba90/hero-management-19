import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertHeroComponent } from './hero-upsert.component';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HeroService } from '../../../services/hero.service';
import { SharedService } from '../../../services/shared.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HeroModel } from '../../models/heroe.model';
import { By } from '@angular/platform-browser';
import { Location } from '@angular/common';

describe('UpsertHeroComponent', () => {
  let component: UpsertHeroComponent;
  let fixture: ComponentFixture<UpsertHeroComponent>;
  let mockHeroService: jasmine.SpyObj<HeroService>;
  let mockSharedService: jasmine.SpyObj<SharedService>;
  let mockLocation: jasmine.SpyObj<Location>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockHeroService = jasmine.createSpyObj('HeroService', [
      'getHeroById',
      'putHero',
      'createHero',
    ]);
    mockSharedService = jasmine.createSpyObj('SharedService', ['openSnackBar']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        UpsertHeroComponent,
        NoopAnimationsModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        UpsertHeroComponent,
      ],
      providers: [
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' })),
            params: of({ id: '1' }),
            queryParams: of({}),
          },
        },
        { provide: HeroService, useValue: mockHeroService },
        { provide: SharedService, useValue: mockSharedService },
        { provide: Location, useValue: mockLocation },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpsertHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    expect(component.heroeForm).toBeTruthy();
  });

  it('should load hero data when id is provided', () => {
    const mockHero: HeroModel = {
      name: 'Superman',
      power: 'Strength',
      height: 180,
      weight: 75,
      enemy: 'Lex Luthor',
    };
    mockHeroService.getHeroById.and.returnValue(of([mockHero]));
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.heroeForm.value).toEqual(mockHero);
  });

  it('should submit form to update hero when id exists', () => {
    component.id = '1';
    component.heroeForm.setValue({
      name: 'Batman',
      power: 'Money',
      height: 190,
      weight: 85,
      enemy: 'Joker',
    });
    mockHeroService.putHero.and.returnValue(of({}));
    component.submit();
    expect(mockHeroService.putHero).toHaveBeenCalledWith(
      '1',
      jasmine.any(Object)
    );
    expect(mockSharedService.openSnackBar).toHaveBeenCalledWith(
      'Su heroe fue modificado'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/list']);
  });

  it('should call location.back when goBack is called', () => {
    component.goBack();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should show error message when getHeroById fails', () => {
    mockHeroService.getHeroById.and.returnValue(throwError(() => new Error('error')));
    
    component.ngOnInit();
    
    fixture.detectChanges();
    expect(mockSharedService.openSnackBar).toHaveBeenCalledWith('Se ha producido un error');
  });
  

  it('should show error message when putHero fails', () => {
    component.id = '1';
    component.heroeForm.setValue({
      name: 'Batman',
      power: 'Money',
      height: 190,
      weight: 85,
      enemy: 'Joker',
    });
    mockHeroService.putHero.and.returnValue(
      throwError(() => new Error('error'))
    );
    component.submit();
    expect(mockSharedService.openSnackBar).toHaveBeenCalledWith(
      'Se ha producido un error'
    );
  });

  it('should show error message when createHero fails', () => {
    component.id = undefined;
    component.heroeForm.setValue({
      name: 'Wonder Woman',
      power: 'Strength',
      height: 180,
      weight: 75,
      enemy: 'Cheetah',
    });
    mockHeroService.createHero.and.returnValue(
      throwError(() => new Error('error'))
    );
    component.submit();
    expect(mockSharedService.openSnackBar).toHaveBeenCalledWith(
      'Se ha producido un error'
    );
  });

  it('should submit form to create hero when id does not exist', () => {
    component.id = undefined;
    component.heroeForm.setValue({
      name: 'Wonder Woman',
      power: 'Strength',
      height: 180,
      weight: 75,
      enemy: 'Cheetah',
    });
    mockHeroService.createHero.and.returnValue(
      of({
        id: 'dasd1',
        name: 'Wonder Woman',
        power: 'Strength',
        height: 180,
        weight: 75,
        enemy: 'Cheetah',
      })
    );

    component.submit();

    expect(mockHeroService.createHero).toHaveBeenCalledWith(
      jasmine.any(Object)
    );
    expect(mockSharedService.openSnackBar).toHaveBeenCalledWith(
      'Su heroe ha sido creado correctamente'
    );
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/list']);
  });
  it('should capitalize the name field input', () => {
    const nameInput = fixture.debugElement.query(
      By.css('input[formControlName="name"]')
    ).nativeElement;
    nameInput.value = 'wonder woman';
    nameInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(nameInput.value).toBe('Wonder Woman');
  });

  it('should have an invalid form when required fields are empty', () => {
    component.heroeForm.setValue({
      name: '',
      power: '',
      height: '',
      weight: '',
      enemy: '',
    });
    expect(component.heroeForm.invalid).toBeTrue();
  });

  it('should have a valid form when required fields are filled', () => {
    component.heroeForm.setValue({
      name: 'Wonder Woman',
      power: 'Strength',
      height: 180,
      weight: 75,
      enemy: 'Cheetah',
    });
    expect(component.heroeForm.valid).toBeTrue();
  });
});
