import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from '../../entities/user.entity';
import { UserCreateDto } from './dto/user.create.dto';
import { CommonUtility } from 'src/utils/common.utility';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: jest.Mocked<Repository<User>>;

  const mockUser = {
    id: 'user-1',
    username: 'testuser',
    email: 'test@example.com',
    password: {
      salt: 'test-salt',
      hash: 'test-hash',
    },
    primaryCurrency: 'TWD',
    preferences: {},
    wallets: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User;

  beforeEach(async () => {
    const mockUserRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const userCreateDto: UserCreateDto = {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'password123',
    };

    it('should create user successfully', async () => {
      const encryptedPassword = { salt: 'new-salt', hash: 'new-hash' };
      jest.spyOn(CommonUtility, 'encryptBySalt').mockReturnValue(encryptedPassword);
      
      const newUser = {
        ...mockUser,
        username: userCreateDto.username,
        email: userCreateDto.email,
        password: encryptedPassword,
      };

      userRepository.create.mockReturnValue(newUser);
      userRepository.save.mockResolvedValue(newUser);

      const result = await service.create(userCreateDto);

      expect(CommonUtility.encryptBySalt).toHaveBeenCalledWith(userCreateDto.password);
      expect(userRepository.create).toHaveBeenCalledWith({
        username: userCreateDto.username,
        email: userCreateDto.email,
        password: encryptedPassword,
      });
      expect(userRepository.save).toHaveBeenCalledWith(newUser);
      expect(result).toEqual(newUser);
    });

    it('should handle database errors', async () => {
      jest.spyOn(CommonUtility, 'encryptBySalt').mockReturnValue({
        salt: 'salt',
        hash: 'hash',
      });
      
      userRepository.create.mockReturnValue(mockUser);
      userRepository.save.mockRejectedValue(new Error('Database error'));

      await expect(service.create(userCreateDto)).rejects.toThrow('Database error');
    });
  });

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
        select: [
          'id',
          'username',
          'email',
          'password',
          'primaryCurrency',
          'preferences',
        ],
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      userRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById('user-1');

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await service.findById('nonexistent-id');

      expect(result).toBeNull();
    });
  });

  describe('updatePrimaryCurrency', () => {
    it('should update primary currency successfully', async () => {
      const updatedUser = { ...mockUser, primaryCurrency: 'USD' };
      jest.spyOn(service, 'findById').mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updatePrimaryCurrency('user-1', 'USD');

      expect(service.findById).toHaveBeenCalledWith('user-1');
      expect(userRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        primaryCurrency: 'USD',
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw error when user not found', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(null);

      await expect(service.updatePrimaryCurrency('user-1', 'USD'))
        .rejects.toThrow('用戶不存在');
    });
  });

  describe('updateUserPreferences', () => {
    it('should update user preferences successfully', async () => {
      const newPreferences = { theme: 'dark', language: 'zh-TW' };
      const updatedUser = {
        ...mockUser,
        preferences: { ...mockUser.preferences, ...newPreferences },
      };
      
      jest.spyOn(service, 'findById').mockResolvedValue(mockUser);
      userRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateUserPreferences('user-1', newPreferences);

      expect(service.findById).toHaveBeenCalledWith('user-1');
      expect(userRepository.save).toHaveBeenCalledWith({
        ...mockUser,
        preferences: { ...mockUser.preferences, ...newPreferences },
      });
      expect(result).toEqual(updatedUser);
    });

    it('should merge with existing preferences', async () => {
      const userWithPrefs = {
        ...mockUser,
        preferences: { theme: 'light', fontSize: 'medium' },
      };
      const newPreferences = { theme: 'dark', language: 'zh-TW' };
      const expectedPreferences = {
        theme: 'dark',
        fontSize: 'medium',
        language: 'zh-TW',
      };
      
      jest.spyOn(service, 'findById').mockResolvedValue(userWithPrefs);
      userRepository.save.mockResolvedValue({
        ...userWithPrefs,
        preferences: expectedPreferences,
      });

      const result = await service.updateUserPreferences('user-1', newPreferences);

      expect(userRepository.save).toHaveBeenCalledWith({
        ...userWithPrefs,
        preferences: expectedPreferences,
      });
    });

    it('should throw error when user not found', async () => {
      jest.spyOn(service, 'findById').mockResolvedValue(null);

      await expect(service.updateUserPreferences('user-1', { theme: 'dark' }))
        .rejects.toThrow('用戶不存在');
    });

    it('should handle null existing preferences', async () => {
      const userWithNullPrefs = {
        ...mockUser,
        preferences: null,
      };
      const newPreferences = { theme: 'dark' };
      
      jest.spyOn(service, 'findById').mockResolvedValue(userWithNullPrefs as any);
      userRepository.save.mockResolvedValue({
        ...userWithNullPrefs,
        preferences: newPreferences,
      });

      const result = await service.updateUserPreferences('user-1', newPreferences);

      expect(userRepository.save).toHaveBeenCalledWith({
        ...userWithNullPrefs,
        preferences: newPreferences,
      });
    });
  });
});
