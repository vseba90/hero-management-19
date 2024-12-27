import { TestBed } from '@angular/core/testing';

import { HeroService } from './hero.service';
import { PaginatedHeroes, HeroModel } from '../hero/models/heroe.model';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('HeroService', () => {
  let service: HeroService;
  let httpMock: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [HeroService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(HeroService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  afterEach(() => {
    httpMock.verify();
  });
  it('should retrieve paginated heroes', () => {
    const mockHeroes: PaginatedHeroes = {
      data: [
        {
          id: '1',
          name: 'Superman',
          power: 'Strength',
          height: 0,
          weight: 0,
          enemy: 'kriptonita',
        },
      ],
      items: 1,
      first: 0,
      prev: 0,
      next: 0,
      last: 0,
      pages: 0,
    };

    service.getPaginatedHeroes(1, 10).subscribe((response) => {
      expect(response).toEqual(mockHeroes);
      expect(service.heroes.value.length).toBe(1);
    });

    const req = httpMock.expectOne(
      `${environment.serverUrl}/heroes?_page=1&_per_page=10&_sort=name`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes);
  });

  it('should create a new hero', () => {
    const newHero: HeroModel = {
      id: '3',
      name: 'Wonder Woman',
      power: 'Strength',
      height: 0,
      weight: 0,
      enemy: 'Venom',
    };

    service.createHero(newHero).subscribe((response) => {
      expect(response).toEqual(newHero);
    });

    const req = httpMock.expectOne(`${environment.serverUrl}/heroes`);
    expect(req.request.method).toBe('POST');
    req.flush(newHero);
  });

  it('should update an existing hero', () => {
    const updatedHero: HeroModel = {
      id: '1',
      name: 'Superman',
      power: 'Flight',
      height: 0,
      weight: 0,
      enemy: 'venom',
    };

    service.putHero('1', updatedHero).subscribe((response) => {
      expect(response).toEqual(updatedHero);
    });

    const req = httpMock.expectOne(`${environment.serverUrl}/heroes/1`);
    expect(req.request.method).toBe('PUT');
    req.flush(updatedHero);
  });

  it('should retrieve a hero by ID', () => {
    const mockHero: HeroModel = {
      id: '1',
      name: 'Superman',
      power: 'Strength',
      height: 0,
      weight: 0,
      enemy: 'Kriptonita',
    };
    service.getHeroById('1').subscribe((hero) => {
      expect(hero[0]).toEqual(mockHero);
    });
    const req = httpMock.expectOne(`${environment.serverUrl}/heroes?id=1`);
    expect(req.request.method).toBe('GET');
    req.flush([mockHero]);
  });

  it('should delete a hero', () => {
    const heroId = '1';
    service.deleteHeroe(heroId).subscribe((response) => {
      expect(response).toBeTruthy();
    });
    const req = httpMock.expectOne(`${environment.serverUrl}/heroes/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
