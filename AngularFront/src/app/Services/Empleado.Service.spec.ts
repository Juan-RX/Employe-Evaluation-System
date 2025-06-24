import { TestBed } from '@angular/core/testing';
import { EmpleadoService } from './Empleado.Service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EmpleadoService', () => {
  let service: EmpleadoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(EmpleadoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
}); 