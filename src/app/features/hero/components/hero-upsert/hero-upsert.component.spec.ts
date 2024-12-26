import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertHeroComponent } from './hero-upsert.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('UpsertHeroComponent', () => {
  let component: UpsertHeroComponent;
  let fixture: ComponentFixture<UpsertHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpsertHeroComponent, NoopAnimationsModule],
      providers: [
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({ id: '1' })),
            params: of({ id: '1' }),
            queryParams: of({}),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UpsertHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});