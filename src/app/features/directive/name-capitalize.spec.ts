
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NameCapitalizeDirective } from './name-capitalize';

@Component({
  template: `<input type="text" appNameCapitalize />`,
  standalone: true,
  imports: [NameCapitalizeDirective],
})
class TestComponent {}

describe('NameCapitalizeDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, TestComponent], 
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should capitalize the first letter of each word', () => {
    const inputEl = fixture.debugElement.query(By.directive(NameCapitalizeDirective)).nativeElement;
    inputEl.value = 'hello world';
    inputEl.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(inputEl.value).toBe('Hello World');
  });

  it('should capitalize a single word', () => {
    const inputEl = fixture.debugElement.query(By.directive(NameCapitalizeDirective)).nativeElement;
    inputEl.value = 'angular';
    inputEl.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(inputEl.value).toBe('Angular');
  });

  it('should handle empty input', () => {
    const inputEl = fixture.debugElement.query(By.directive(NameCapitalizeDirective)).nativeElement;
    inputEl.value = '';
    inputEl.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(inputEl.value).toBe('');
  });
});
