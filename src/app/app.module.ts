import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingInterceptor } from './features/interceptor/loading.inteceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app.routes';
@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    NoopAnimationsModule,
    RouterModule.forRoot([]),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    provideAnimationsAsync(),
    provideHttpClient()
  ],
})
export class AppModule {}
