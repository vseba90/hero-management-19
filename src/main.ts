import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { LoadingInterceptor } from './app/features/interceptor/loading.inteceptor';
import { provideAnimations } from '@angular/platform-browser/animations';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    provideAnimations()
  ],
}).catch((err) => console.error(err));
