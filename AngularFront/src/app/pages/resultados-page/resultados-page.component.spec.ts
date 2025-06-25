import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultadosPageComponent } from './resultados-page.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ResultadosPageComponent', () => {
  let component: ResultadosPageComponent;
  let fixture: ComponentFixture<ResultadosPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule, ResultadosPageComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ResultadosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 