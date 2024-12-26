import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeroModel } from '../../models/heroe.model';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import {
  combineLatest,
  debounceTime,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { HeroService } from '../../../services/hero.service';
import { SharedService } from '../../../services/shared.service';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    RouterModule,
    MatPaginatorModule,
  ],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroListComponent implements OnInit, OnDestroy {
  #heroService = inject(HeroService);
  #sharedService = inject(SharedService);
  #dialog = inject(MatDialog);

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  #unsubscribe = new Subject<void>();
  searchSubject = new Subject<string>();

  @ViewChild('searchInput') searchInput: ElementRef | undefined;

  displayedColumns: string[] = [
    'name',
    'power',
    'height',
    'weight',
    'enemy',
    'actions',
  ];

  pageSize = 5;
  pageIndex = 1;
  pageEvent: PageEvent | undefined;

  vm$ = combineLatest({
    heroes: this.#heroService.heroes.asObservable(),
    totalHeroes: this.#heroService.totalHeroes.asObservable(),
    isPaginatorAvailable: this.#heroService.isPaginatorAvailable.asObservable(),
  });

  ngOnInit(): void {
    this.#heroService.isPaginatorAvailable.next(true);
    this.#heroService
      .getPaginatedHeroes(this.pageIndex, this.pageSize)
      .pipe(takeUntil(this.#unsubscribe))
      .subscribe({
        error: () => {
          this.#sharedService.openSnackBar('Se ha producido un error');
        },
      });

    this.searchSubject
      .pipe(
        debounceTime(500),
        switchMap(async (searchTerm) => this.filterHeroes(searchTerm)),
        takeUntil(this.#unsubscribe)
      )
      .subscribe({
        error: () => {
          this.#sharedService.openSnackBar('Se ha producido un error');
        },
      });
  }
  filterHeroes(searchTerm: string) {
    this.pageIndex = 1;
    if (searchTerm === '') {
      this.#heroService
        .getPaginatedHeroes(this.pageIndex, this.pageSize)
        .subscribe({
          error: () => {
            this.#sharedService.openSnackBar('Se ha producido un error');
          },
        });
      this.#heroService.isPaginatorAvailable.next(true);
    } else {
      this.#heroService.getHeroes(searchTerm).subscribe({
        error: () => {
          this.#sharedService.openSnackBar('Se ha producido un error');
        },
      });
      this.#heroService.isPaginatorAvailable.next(false);
    }
  }
  getSearchWord() {
    if (!this.searchInput) {
      return;
    }
    const searchTerm = this.searchInput.nativeElement.value.toLowerCase();
    this.searchSubject.next(searchTerm);
  }

  deleteHeroe(heroe: HeroModel): void {
    const dialogRef = this.#dialog.open(DialogConfirmComponent, {
      width: '400px',
      data: heroe,
    });

    dialogRef.afterClosed().subscribe((heroe) => {
      if (heroe) {
        this.#heroService
          .deleteHeroe(heroe.id)
          .pipe(takeUntil(this.#unsubscribe))
          .subscribe({
            next: () => {
              if (!this.searchInput) {
                return;
              }
              this.pageIndex = 1;
              this.#heroService
                .getPaginatedHeroes(this.pageIndex, this.pageSize)
                .subscribe();
              this.searchInput.nativeElement.value = '';
              this.#sharedService.openSnackBar('Su heroe ha sido borrado');

              this.pageIndex = 0;
            },
            error: () => {
              this.#sharedService.openSnackBar('Se ha producido un error');
            },
          });
      }
    });
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pageIndex = e.pageIndex;
    this.#heroService
      .getPaginatedHeroes(this.pageIndex + 1, this.pageSize)
      .subscribe({
        error: () => {
          this.#sharedService.openSnackBar('Se ha producido un error');
        },
      });
  }

  ngOnDestroy(): void {
    this.#unsubscribe.next();
    this.#unsubscribe.complete();
  }
}
