import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NameCapitalizeDirective } from '../../../directive/name-capitalize';
import { HeroService } from '../../../services/hero.service';
import { SharedService } from '../../../services/shared.service';
import { HeroModel } from '../../models/heroe.model';

@Component({
  selector: 'app-hero-upsert',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    NameCapitalizeDirective,
  ],
  templateUrl: './hero-upsert.component.html',
  styleUrl: './hero-upsert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertHeroComponent implements OnInit, OnDestroy {
  activatedRoute = inject(ActivatedRoute);
  #sharedService = inject(SharedService);
  #fb = inject(FormBuilder);
  #router = inject(Router);
  #location = inject(Location);
  #heroesServices = inject(HeroService);
  #unsubscribe = new Subject<void>();

  heroeForm: FormGroup = this.#fb.group({
    name: ['', Validators.required],
    power: ['', Validators.required],
    height: ['', Validators.required],
    weight: ['', Validators.required],
    enemy: ['', Validators.required],
  });
  id: string | undefined = '';

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id'];
      if (this.id) {
        this.#heroesServices
          .getHeroById(this.id)
          .pipe(takeUntil(this.#unsubscribe))
          .subscribe({
            next: (hero: HeroModel[]) => {
              if (hero) {
                this.heroeForm.patchValue(hero[0]);
              }
            },
            error: () => {
              this.#sharedService.openSnackBar('Se ha producido un error');
            },
          });
      }
    });
  }

  get f() {
    return this.heroeForm.controls;
  }

  goBack() {
    this.#location.back();
  }

  submit() {
    const data = {
      id: this.id,
      name: this.f['name'].value,
      power: this.f['power'].value,
      height: this.f['height'].value,
      weight: this.f['weight'].value,
      enemy: this.f['enemy'].value,
    };

    if (this.id) {
      this.#heroesServices
        .putHero(this.id, data)
        .pipe(takeUntil(this.#unsubscribe))
        .subscribe({
          next: () => {
            this.redirectToList('Su heroe fue modificado');
          },
          error: () => {
            this.#sharedService.openSnackBar('Se ha producido un error');
          },
        });
    } else {
      delete data.id;
      this.#heroesServices
        .createHero(data)
        .pipe(takeUntil(this.#unsubscribe))
        .subscribe({
          next: () => {
            this.redirectToList('Su heroe ha sido creado correctamente');
          },
          error: () => {
            this.#sharedService.openSnackBar('Se ha producido un error');
          },
        });
    }
  }

  redirectToList(message: string) {
    this.#sharedService.openSnackBar(message);
    this.#router.navigate(['/list']);
  }
  ngOnDestroy(): void {
    this.#unsubscribe.next();
    this.#unsubscribe.complete();
  }
}
