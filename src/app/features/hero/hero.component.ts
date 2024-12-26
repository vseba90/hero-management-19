import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TopbarComponent } from './components/topbar/topbar.component';
import { RouterModule } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, TopbarComponent, RouterModule, MatProgressBarModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  #sharedService = inject(SharedService);

  isLoading$ = this.#sharedService.loading$;
}
