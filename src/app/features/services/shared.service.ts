import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  #snackBar = inject(MatSnackBar);
  
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  
  setLoading(isLoading: boolean): void {
    this.loadingSubject.next(isLoading);
  }

  openSnackBar(message: string) {
    this.#snackBar.open(message, '', {
      duration: 1500,
    });
  }

}
