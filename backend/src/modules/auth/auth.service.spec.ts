import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CommonUtility } from 'src/utils/common.utility';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockUser = {
    id: 'test-user-id',
    username: 'testuser',
    email: 'test@example.com',
    password: {
      salt: 'test-salt',
      hash: 'test-hash',
    },
    primaryCurrency: 'TWD',
    preferences: {},
    wallets: [],
  };

  beforeEach(async () => {
    const mockUsersService = {
      findByEmail: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';

      usersService.findByEmail.mockResolvedValue(mockUser);

      // Mock CommonUtility.encryptBySalt to return the expected hash
      jest.spyOn(CommonUtility, 'encryptBySalt').mockReturnValue({
        salt: 'test-salt',
        hash: 'test-hash',
      });

      const result = await service.validateUser(email, password);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(CommonUtility.encryptBySalt).toHaveBeenCalledWith(
        password,
        'test-salt',
      );
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      const email = 'nonexistent@example.com';
      const password = 'testpassword';

      usersService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser(email, password);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      usersService.findByEmail.mockResolvedValue(mockUser);

      // Mock CommonUtility.encryptBySalt to return a different hash
      jest.spyOn(CommonUtility, 'encryptBySalt').mockReturnValue({
        salt: 'test-salt',
        hash: 'wrong-hash',
      });

      const result = await service.validateUser(email, password);

      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(CommonUtility.encryptBySalt).toHaveBeenCalledWith(
        password,
        'test-salt',
      );
      expect(result).toBeNull();
    });

    it('should handle user without password correctly', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';
      const userWithoutPassword = {
        ...mockUser,
        password: undefined,
      };

      usersService.findByEmail.mockResolvedValue(userWithoutPassword as any);

      await expect(service.validateUser(email, password)).rejects.toThrow();
    });
  });

  describe('generateAccessToken', () => {
    it('should generate access token with correct payload', async () => {
      const expectedToken = 'signed-jwt-token';
      jwtService.sign.mockReturnValue(expectedToken);

      const result = await service.generateAccessToken(mockUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
      });
      expect(result).toEqual({
        access_token: expectedToken,
      });
    });

    it('should handle user with minimal properties', async () => {
      const minimalUser = {
        id: 'test-id',
        username: 'testuser',
      };
      const expectedToken = 'signed-jwt-token';
      jwtService.sign.mockReturnValue(expectedToken);

      const result = await service.generateAccessToken(minimalUser);

      expect(jwtService.sign).toHaveBeenCalledWith({
        username: minimalUser.username,
        sub: minimalUser.id,
      });
      expect(result).toEqual({
        access_token: expectedToken,
      });
    });

    it('should handle jwt service errors', async () => {
      jwtService.sign.mockImplementation(() => {
        throw new Error('JWT signing failed');
      });

      await expect(service.generateAccessToken(mockUser)).rejects.toThrow(
        'JWT signing failed',
      );
    });
  });
});
