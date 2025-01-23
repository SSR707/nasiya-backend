import { Test, TestingModule } from '@nestjs/testing';
import { DebtorController } from './debtor.controller';
import { DebtorService } from './debtor.service';
import { CreateDebtorDto } from './dto';
import { Debtor } from '../../core/entity/debtor.entity';

describe('DebtorController', () => {
  let controller: DebtorController;
  let service: DebtorService;

  const mockDebtorService = {
    create: jest.fn(),
    findAllActive: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DebtorController],
      providers: [
        {
          provide: DebtorService,
          useValue: mockDebtorService,
        },
      ],
    }).compile();

    controller = module.get<DebtorController>(DebtorController);
    service = module.get<DebtorService>(DebtorService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new debtor', async () => {
      const createDebtorDto: CreateDebtorDto = {
        full_name: 'Boylar',
        phone_number: '+998977777777',
        address: 'Toshkent, Uzbekistan',
        note: 'Note',
      };

      const expectedResult = {
        id: '123',
        ...createDebtorDto,
        created_at: Date.now(),
        updated_at: Date.now(),
        is_deleted: false,
      };

      jest.spyOn(service, 'create').mockResolvedValue(expectedResult as Debtor);

      const result = await controller.create(createDebtorDto);
      expect(result).toBe(expectedResult);
      expect(service.create).toHaveBeenCalledWith(createDebtorDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of debtors', async () => {
      const expectedResult = [
        {
          id: '123',
          full_name: 'Boylar',
          phone_number: '+998977777777',
          address: 'Toshkent, Uzbekistan',
          note: 'Note',
          created_at: Date.now(),
          updated_at: Date.now(),
          is_deleted: false,
        },
      ];

      jest.spyOn(service, 'findAllActive').mockResolvedValue(expectedResult as Debtor[]);

      const result = await controller.findAll();
      expect(result).toBe(expectedResult);
      expect(service.findAllActive).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single debtor', async () => {
      const id = '123';
      const expectedResult = {
        id,
        full_name: 'Boylar',
        phone_number: '+998977777777',
        address: 'Toshkent, Uzbekistan',
        note: 'Note',
        created_at: Date.now(),
        updated_at: Date.now(),
        is_deleted: false,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult as Debtor);

      const result = await controller.findOne(id);
      expect(result).toBe(expectedResult);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });
});
