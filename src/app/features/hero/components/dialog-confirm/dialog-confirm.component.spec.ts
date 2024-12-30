import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogConfirmComponent } from './dialog-confirm.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HeroModel } from '../../models/heroe.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';

describe('DialogConfirmComponent', () => {
  let component: DialogConfirmComponent;
  let fixture: ComponentFixture<DialogConfirmComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<DialogConfirmComponent>>;

  const mockHero: HeroModel = {
    id: '1',
    name: 'Superman',
    power: 'Strength',
    height: 180,
    weight: 75,
    enemy: 'Lex Luthor',
  };

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        DialogConfirmComponent,
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: mockHero },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display the hero name in the dialog', () => {
    const nameElement = fixture.debugElement.query(By.css('p b')).nativeElement;
    expect(nameElement.textContent).toContain('Superman');
  });

  it('should call onNoClick when Cancelar button is clicked', () => {
    spyOn(component, 'onNoClick').and.callThrough();
    const cancelButton = fixture.debugElement.query(
      By.css('button[mat-button]')
    ).nativeElement;
    cancelButton.click();
    expect(component.onNoClick).toHaveBeenCalled();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should close the dialog with hero data when Confirmar button is clicked', () => {
    const confirmButton = fixture.debugElement.query(
      By.css('button[mat-flat-button]')
    ).nativeElement;
    confirmButton.click();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(mockHero);
  });
  it('should close the dialog when onNoClick is called', () => {
    component.onNoClick();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
