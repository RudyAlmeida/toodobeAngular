import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { BillingsDetailsComponent } from "./details.component";

describe("BillingsDetailsComponent", () => {
  let component: BillingsDetailsComponent;
  let fixture: ComponentFixture<BillingsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BillingsDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
