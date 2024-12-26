import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { SharedService } from '../services/shared.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  #sharedService = inject(SharedService);

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    this.#sharedService.setLoading(true);
    return next.handle(req).pipe(
      finalize(() => {
        this.#sharedService.setLoading(false);
      })
    );
  }
}
