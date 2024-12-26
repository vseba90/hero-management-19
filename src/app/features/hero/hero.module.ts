import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroRoutingModule } from './hero-routing.module';
import { RouterModule } from '@angular/router';
import { HeroService } from '../services/hero.service';
import { NameCapitalizeDirective } from '../directive/name-capitalize';
import { provideHttpClient } from '@angular/common/http';
@NgModule({
  imports: [
    CommonModule,
    HeroRoutingModule,
    RouterModule,
    NameCapitalizeDirective,
  ],
  providers: [HeroService, provideHttpClient()],
})
export class HeroModule {}
