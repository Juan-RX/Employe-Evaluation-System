import { TestBed } from '@angular/core/testing';
import { PuestoService } from './Puesto.Service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PuestoService', () => {
  let service: PuestoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PuestoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
}); 