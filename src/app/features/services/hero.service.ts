import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  takeUntil,
  tap,
} from 'rxjs';
import { HeroModel, PaginatedHeroes } from '../hero/models/heroe.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

const BASE_URL = `${environment.serverUrl}`;
@Injectable({
  providedIn: 'root',
})
export class HeroService {
  #http = inject(HttpClient);

  #unsubscribe = new Subject<void>();
  heroes = new BehaviorSubject<HeroModel[]>([]);
  totalHeroes = new BehaviorSubject<number>(0);
  isPaginatorAvailable = new BehaviorSubject<boolean>(true);

  getPaginatedHeroes(pageIndex: number, pageSize: number) {
    let endpoint = `${BASE_URL}/heroes?_page=${pageIndex}&_per_page=${pageSize}&_sort=name`;

    return this.#http.get<PaginatedHeroes>(endpoint).pipe(
      tap((heroes) => {
        this.heroes.next(heroes.data);
        this.totalHeroes.next(heroes.items);
      }),
      takeUntil(this.#unsubscribe)
    );
  }

  getHeroes(searchFilter: string) {
    let endpoint = `${BASE_URL}/heroes`;
    return this.#http.get<HeroModel[]>(endpoint).pipe(
      tap((heroes) => {
        if (heroes) {
          const filterHeroes = heroes.filter((hero) =>
            hero.name.toLowerCase().includes(searchFilter.toLowerCase())
          );
          this.heroes.next(filterHeroes);
        }
      }),
      takeUntil(this.#unsubscribe)
    );
  }

  putHero(id: string, hero: HeroModel) {
    const endpoint = `${BASE_URL}/heroes/${id}`;
    return this.#http.put(endpoint, hero);
  }

  createHero(hero: HeroModel) {
    const endpoint = `${BASE_URL}/heroes`;
    return this.#http.post<HeroModel>(endpoint, hero);
  }

  deleteHeroe(id: string) {
    const endpoint = `${BASE_URL}/heroes/${id}`;
    return this.#http.delete(endpoint);
  }

  getHeroById(id: string): Observable<HeroModel[]> {
    const endpoint = `${BASE_URL}/heroes?id=${id}`;
    return this.#http.get<HeroModel[]>(endpoint);
  }
}
