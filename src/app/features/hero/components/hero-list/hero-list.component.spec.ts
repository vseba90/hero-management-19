import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroListComponent } from './hero-list.component'; 
import { SharedService } from '../../../services/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HeroModel, PaginatedHeroes } from '../../models/heroe.model';
import { HeroService } from '../../../services/hero.service';
describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;
  let mockHeroService: jasmine.SpyObj<HeroService>;
  let mockSharedService: jasmine.SpyObj<SharedService>;
  let mockDialog: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    mockHeroService = jasmine.createSpyObj('HeroService', [
      'getPaginatedHeroes',
      'getHeroes',
      'deleteHeroe',
    ]);
    mockSharedService = jasmine.createSpyObj('SharedService', ['openSnackBar']);
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);

    mockHeroService.heroes = { asObservable: () => of([]) } as any;
    mockHeroService.totalHeroes = { asObservable: () => of(0) } as any;
    mockHeroService.isPaginatorAvailable = {
      asObservable: () => of(true),
    } as any;

    mockHeroService.isPaginatorAvailable = new BehaviorSubject<boolean>(true);
    const heroes = [
      {
        id: '1',
        name: 'Superman',
        power: 'Strength',
        height: 180,
        weight: 75,
        enemy: 'Lex Luthor',
      },
    ];
    const mockPaginatedHeroes: PaginatedHeroes = {
      data: heroes,
      first: 0,
      prev: 0,
      next: 0,
      last: 0,
      items: 0,
      pages: 0,
    };
    mockHeroService.getPaginatedHeroes.and.returnValue(of(mockPaginatedHeroes));
    mockHeroService.getHeroes.and.returnValue(of([]));
    mockHeroService.deleteHeroe.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule,
        NoopAnimationsModule,
        RouterModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
        HeroListComponent,
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: HeroService, useValue: mockHeroService },
        { provide: SharedService, useValue: mockSharedService },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ActivatedRoute, useValue: { params: of({}) } },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize and load heroes', () => {
    const heroes = [
      {
        id: '1',
        name: 'Superman',
        power: 'Strength',
        height: 180,
        weight: 75,
        enemy: 'Lex Luthor',
      },
    ];
    mockHeroService.getPaginatedHeroes.and.returnValue(
      of({
        data: heroes,
        first: 1,
        prev: 1,
        next: 1,
        last: 1,
        pages: 5,
        items: 9,
      })
    );
    component.ngOnInit();
    fixture.detectChanges();
    expect(mockHeroService.getPaginatedHeroes).toHaveBeenCalledWith(1, 5);
  });

  it('should filter heroes on search', () => {
    const searchTerm = 'Superman';
    spyOn(component.searchSubject, 'next');
    component.getSearchWord();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    input.value = searchTerm;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.searchSubject.next).toHaveBeenCalledWith(
      searchTerm.toLowerCase()
    );
  });

  it('should call getSearchWord when input is provided in search field', () => {
    spyOn(component, 'getSearchWord');
    const searchInput = fixture.debugElement.query(
      By.css('input[type="search"]')
    ).nativeElement;
    searchInput.value = 'Superman';
    searchInput.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(component.getSearchWord).toHaveBeenCalled();
  });

  it('should open delete dialog and call deleteHeroe', () => {
    const hero: HeroModel = {
      id: '1',
      name: 'Superman',
      power: 'Strength',
      height: 180,
      weight: 75,
      enemy: 'Lex Luthor',
    };
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(hero) });
    mockDialog.open.and.returnValue(dialogRefSpyObj);
    spyOn(component, 'deleteHeroe').and.callThrough();
    component.deleteHeroe(hero);
    fixture.detectChanges();
    expect(mockDialog.open).toHaveBeenCalled();
    expect(mockHeroService.deleteHeroe).toHaveBeenCalledWith('1');
  });

  it('should handle page event', () => {
    const pageEvent: PageEvent = { pageIndex: 1, pageSize: 5, length: 10 };
    spyOn(component, 'handlePageEvent').and.callThrough();
    component.handlePageEvent(pageEvent);
    fixture.detectChanges();
    expect(mockHeroService.getPaginatedHeroes).toHaveBeenCalledWith(
      pageEvent.pageIndex + 1,
      pageEvent.pageSize
    );
  });

  it('should display error snackbar on getPaginatedHeroes error', () => {
    mockHeroService.getPaginatedHeroes.and.returnValue(
      throwError(() => new Error('error'))
    );
    component.ngOnInit();
    fixture.detectChanges();
    expect(mockSharedService.openSnackBar).toHaveBeenCalledWith(
      'Se ha producido un error'
    );
  });

  it('should display error snackbar on search error', () => {
    spyOn(component, 'filterHeroes').and.callThrough();
    mockHeroService.getHeroes.and.returnValue(
      throwError(() => new Error('error'))
    );
    component.filterHeroes('searchTerm');
    fixture.detectChanges();
    expect(mockSharedService.openSnackBar).toHaveBeenCalledWith(
      'Se ha producido un error'
    );
  });

});
