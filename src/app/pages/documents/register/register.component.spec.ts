import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { DocumentsRegisterComponent } from "./register.component";

describe("DocumentsRegisterComponent", () => {
  let component: DocumentsRegisterComponent;
  let fixture: ComponentFixture<DocumentsRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentsRegisterComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
