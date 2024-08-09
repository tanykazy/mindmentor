import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MindmapFieldComponent } from './mindmap-field.component';

describe('MindmapFieldComponent', () => {
  let component: MindmapFieldComponent;
  let fixture: ComponentFixture<MindmapFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MindmapFieldComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MindmapFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
