import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SubscriptionsDetailsComponent } from "./details.component";

describe("SubscriptionsDetailsComponent", () => {
  let component: SubscriptionsDetailsComponent;
  let fixture: ComponentFixture<SubscriptionsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriptionsDetailsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
