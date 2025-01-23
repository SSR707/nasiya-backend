import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DebtorService } from './debtor.service';
import { Debtor } from '../../core/entity/debtor.entity';
import { CreateDebtorDto } from './dto';
import { NotFoundException } from '@nestjs/common';

describe('DebtorService', () => {
  let service: DebtorService;
  let repository: Repository<Debtor>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DebtorService,
        {
          provide: getRepositoryToken(Debtor),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<DebtorService>(DebtorService);
    repository = module.get<Repository<Debtor>>(getRepositoryToken(Debtor));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a debtor if found', async () => {
      const mockDebtor = {
        id: '123',
        full_name: 'Test User',
        phone_number: '+998901234567',
        address: 'Test Address',
        note: 'Test Note',
        is_deleted: false,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockDebtor as Debtor);

      const result = await service.findOne('123');
      expect(result).toEqual(mockDebtor);
    });

    it('should throw NotFoundException if debtor not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne('123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllActive', () => {
    it('should return all active debtors', async () => {
      const mockDebtors = [
        {
          id: '123',
          full_name: 'Test User 1',
          phone_number: '+998901234567',
          address: 'Test Address 1',
          note: 'Test Note 1',
          is_deleted: false,
        },
        {
          id: '124',
          full_name: 'Test User 2',
          phone_number: '+998901234568',
          address: 'Test Address 2',
          note: 'Test Note 2',
          is_deleted: false,
        },
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(mockDebtors as Debtor[]);

      const result = await service.findAllActive();
      expect(result).toEqual(mockDebtors);
    });
  });

  describe('softDelete', () => {
    it('should soft delete a debtor', async () => {
      const mockDebtor = {
        id: '123',
        full_name: 'Test User',
        phone_number: '+998901234567',
        address: 'Test Address',
        note: 'Test Note',
        is_deleted: false,
      };

      jest.spyOn(repository, 'findOne').mockResolvedValue(mockDebtor as Debtor);
      jest.spyOn(repository, 'save').mockResolvedValue({ ...mockDebtor, is_deleted: true } as Debtor);

      await service.softDelete('123');
      expect(repository.save).toHaveBeenCalledWith({ ...mockDebtor, is_deleted: true });
    });
  });
});
