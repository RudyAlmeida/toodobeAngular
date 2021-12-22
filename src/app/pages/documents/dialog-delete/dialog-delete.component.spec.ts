import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DialogDeleteDocumentComponent } from "./dialog-delete.component";

describe("DialogDeleteDocumentComponent", () => {
  let component: DialogDeleteDocumentComponent;
  let fixture: ComponentFixture<DialogDeleteDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogDeleteDocumentComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDeleteDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
