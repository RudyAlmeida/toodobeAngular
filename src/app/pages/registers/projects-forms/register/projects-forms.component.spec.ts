import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsFormsComponent } from './projects-forms.component';

describe('ProjectsFormsComponent', () => {
  let component: ProjectsFormsComponent;
  let fixture: ComponentFixture<ProjectsFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
