export interface HeroModel {
  id?: string;
  name: string;
  power: string;
  height: number;
  weight: number;
  enemy: string;
}

export interface PaginatedHeroes {
  data: HeroModel[];
  first: number;
  prev: number;
  next: number;
  last: number;
  pages: number;
  items: number;
}