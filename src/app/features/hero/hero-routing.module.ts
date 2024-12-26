import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroComponent } from './hero.component';
import { HeroListComponent } from './components/hero-list/hero-list.component';
import { UpsertHeroComponent } from './components/hero-upsert/hero-upsert.component';

const routes: Routes = [
  {
    path: '',
    component: HeroComponent,
    children: [
      {
        path: 'list',
        component: HeroListComponent,
      },
      {
        path: 'create-hero',
        component: UpsertHeroComponent,
      },
      {
        path: 'edit-hero/:id',
        component: UpsertHeroComponent,
      },

      { path: '**', redirectTo: 'list' },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeroRoutingModule {}
