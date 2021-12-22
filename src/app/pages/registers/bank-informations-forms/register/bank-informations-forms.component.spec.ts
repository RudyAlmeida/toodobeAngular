import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BankInformationsFormsComponent } from './bank-informations-forms.component';

describe('BankInformationsFormsComponent', () => {
  let component: BankInformationsFormsComponent;
  let fixture: ComponentFixture<BankInformationsFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BankInformationsFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BankInformationsFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
