import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogDeleteBillingsComponent } from "./dialog-delete.component";

describe("DialogDeleteBillingsComponent", () => {
  let component: DialogDeleteBillingsComponent;
  let fixture: ComponentFixture<DialogDeleteBillingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogDeleteBillingsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteBillingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
