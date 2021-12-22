import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogDeleteSubscriptionsComponent } from "./dialog-delete.component";

describe("DialogDeleteSubscriptionsComponent", () => {
  let component: DialogDeleteSubscriptionsComponent;
  let fixture: ComponentFixture<DialogDeleteSubscriptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogDeleteSubscriptionsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteSubscriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
