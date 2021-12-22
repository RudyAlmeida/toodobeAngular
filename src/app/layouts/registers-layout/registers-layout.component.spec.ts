import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { RegistersLayoutComponent } from "./registers-layout.component";

describe("RegistersLayoutComponent", () => {
  let component: RegistersLayoutComponent;
  let fixture: ComponentFixture<RegistersLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegistersLayoutComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistersLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
