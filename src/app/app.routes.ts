import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/hero/hero.module').then((m) => m.HeroModule),
  },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
@NgModule({ imports: [RouterModule.forRoot(routes)], exports: [RouterModule] })
export class AppRoutingModule {}
