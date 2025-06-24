import { TestBed } from '@angular/core/testing';
import { EvaluacionService } from './Evaluacion.Service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EvaluacionService', () => {
  let service: EvaluacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(EvaluacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
}); 