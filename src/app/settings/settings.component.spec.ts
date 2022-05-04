import { ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthorizationService } from 'src/app/authorization/shared/services/authorization.service';
import { UserService } from 'src/app/shared/services/user.service';

import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let userService: UserService;
  const routerSpy = { navigate: jasmine.createSpy('navigate') };
  const user = {
    user: {
      email: 'string',
      token: 'string',
      username: 'string',
      bio: 'string',
      image: 'string',
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [SettingsComponent],
      providers: [
        {
          provide: AuthorizationService,
          useValue: {
            logout: () => of(),
          },
        },
        {
          provide: UserService,
          useValue: {
            getUser: () => of(user.user),
            updateUser: () => of(user),
          },
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Function logout', () => {
    it('Then: call logout by click ', () => {
      const componentSpy = spyOn(component, 'logout').and.callThrough();
      let button: HTMLElement = fixture.debugElement.nativeElement.querySelector('.btn-logout');
      button.click();
      expect(componentSpy).toHaveBeenCalled();
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    });
  });

  describe('Function updateUser', () => {
    it('Then: call updateUser by click ', () => {
      const componentSpy = spyOn(component, 'updateUser').and.callThrough();
      let button: HTMLElement = fixture.debugElement.nativeElement.querySelector('.btn-lg');
      button.click();
      expect(componentSpy).toHaveBeenCalled();
    });
    it('Then: return value from updateUser', fakeAsync(() => {
      const serviceSpy = spyOn(userService, 'updateUser').and.returnValue(of(user));
      component.updateUser();
      expect(serviceSpy).toHaveBeenCalled();
      tick(1);
      expect(component.user).toEqual(user.user);
      flush();
    }));
    it('Then: handle error', fakeAsync(() => {
      spyOn(console, 'log').and.throwError;
      const serviceSpy = spyOn(userService, 'updateUser').and.returnValue(
        throwError(() => new Error('Unique constraint failed on the fields: (`email`)'))
      );
      component.updateUser();
      expect(serviceSpy).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalled();
    }));
  });
});
