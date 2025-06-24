import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './AuthGuard';
import { AuthService } from './Auth.Service';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  const executeGuard = (route: any, state: any) => TestBed.runInInjectionContext(() => AuthGuard(route, state));

  it('should allow the authenticated user', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    const result = executeGuard({} as any, {} as any);
    expect(result).toBeTrue();
  });

  it('should redirect unauthenticated user to login', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);
    const result = executeGuard({} as any, {} as any);
    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
}); 