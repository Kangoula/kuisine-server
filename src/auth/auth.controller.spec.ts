import { TestBed } from '@suites/unit';
import { AuthController } from './auth.controller';
import { Mocked } from '@suites/doubles.jest';
import { AuthService, CookieTypeNames } from './auth.service';
import { generateOne } from '~test-utils';
import { User } from '@/users/entities/user.entity';
import { Response } from 'express';
import { UsersService } from '@/users/users.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Mocked<AuthService>;
  let usersService: Mocked<UsersService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(AuthController).compile();

    controller = unit;
    authService = unitRef.get(AuthService);
    usersService = unitRef.get(UsersService);
  });

  describe('login', () => {
    it('should set Authorization and Refresh cookies plus return user', async () => {
      const user = generateOne(User);
      user.id = 1;

      const accessCookie = {
        name: CookieTypeNames.Access,
        token: 'test',
        params: {},
      };

      const refreshCookie = {
        name: CookieTypeNames.Refresh,
        token: 'test-refresh',
        params: {},
      };

      authService.getCookieParametersForAccessToken.mockReturnValue(
        accessCookie,
      );
      authService.getCookieParametersForRefreshToken.mockReturnValue(
        refreshCookie,
      );

      const mockResponse = { cookie: jest.fn() } as Mocked<Response>;

      const result = await controller.logIn(user, mockResponse);

      expect(
        authService.getCookieParametersForAccessToken,
      ).toHaveBeenCalledWith(user.id);
      expect(
        authService.getCookieParametersForRefreshToken,
      ).toHaveBeenCalledWith(user.id);

      expect(usersService.setCurrentRefreshToken).toHaveBeenCalledWith(
        user.id,
        refreshCookie.token,
      );

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        accessCookie.name,
        accessCookie.token,
        accessCookie.params,
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        refreshCookie.name,
        refreshCookie.token,
        refreshCookie.params,
      );

      expect(result).toHaveProperty('username', user.username);
    });
  });

  describe('logout', () => {
    it('should clear Authorization and Refresh cookies', async () => {
      const user = generateOne(User);
      user.id = 1;

      const logoutAccessCookie = {
        name: CookieTypeNames.Access,
        token: '',
        params: {},
      };

      const logoutRefreshCookie = {
        name: CookieTypeNames.Refresh,
        token: '',
        params: {},
      };

      authService.getLogoutCookieParametersForAccessToken.mockReturnValue(
        logoutAccessCookie,
      );
      authService.getLogoutCookieParametersForRefreshToken.mockReturnValue(
        logoutRefreshCookie,
      );

      const mockResponse = { cookie: jest.fn() } as Mocked<Response>;

      await controller.logOut(user, mockResponse);

      expect(
        authService.getLogoutCookieParametersForAccessToken,
      ).toHaveBeenCalled();
      expect(
        authService.getLogoutCookieParametersForRefreshToken,
      ).toHaveBeenCalled();

      expect(usersService.removeRefreshToken).toHaveBeenCalledWith(user.id);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        logoutAccessCookie.name,
        logoutAccessCookie.token,
        logoutAccessCookie.params,
      );
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        logoutRefreshCookie.name,
        logoutRefreshCookie.token,
        logoutRefreshCookie.params,
      );
    });
  });

  describe('me', () => {
    it('should return current user infos', () => {
      const user = generateOne(User);
      user.id = 1;

      const result = controller.authenticate(user);

      expect(result).toEqual(user);
    });
  });

  describe('refresh', () => {
    it('should return a new Access cookie', () => {
      const user = generateOne(User);
      user.id = 1;

      const accessCookie = {
        name: CookieTypeNames.Access,
        token: 'test',
        params: {},
      };

      authService.getCookieParametersForAccessToken.mockReturnValue(
        accessCookie,
      );

      const mockResponse = { cookie: jest.fn() } as Mocked<Response>;

      controller.refresh(user, mockResponse);

      expect(
        authService.getCookieParametersForAccessToken,
      ).toHaveBeenCalledWith(user.id);

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        accessCookie.name,
        accessCookie.token,
        accessCookie.params,
      );
    });
  });
});
