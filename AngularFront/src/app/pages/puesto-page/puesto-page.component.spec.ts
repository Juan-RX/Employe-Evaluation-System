import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PuestoPageComponent } from './puesto-page.component';

describe('PuestoPageComponent', () => {
  let component: PuestoPageComponent;
  let fixture: ComponentFixture<PuestoPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PuestoPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PuestoPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 