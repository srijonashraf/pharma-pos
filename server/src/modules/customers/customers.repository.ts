import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CustomerSearchDto } from './dto/customer-search.dto';
import { PaginatedResult } from '../../common/types/pagination.type';

@Injectable()
export class CustomersRepository {
  constructor(
    @InjectRepository(Customer)
    private readonly repository: Repository<Customer>,
  ) {}

  async findWithFilter(
    filter: CustomerSearchDto,
  ): Promise<PaginatedResult<Customer>> {
    const { search, phone, page = 1, limit = 20 } = filter;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('customer');

    if (search) {
      queryBuilder.andWhere(
        '(customer.name ILIKE :search OR customer.displayName ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (phone) {
      queryBuilder.andWhere('customer.phone ILIKE :phone', {
        phone: `%${phone}%`,
      });
    }

    const [data, total] = await queryBuilder
      .orderBy('customer.name', 'ASC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string): Promise<Customer | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    return this.repository.findOne({ where: { phone } });
  }

  async create(data: Partial<Customer>): Promise<Customer> {
    const customer = this.repository.create(data);
    return this.repository.save(customer);
  }

  async update(id: string, data: Partial<Customer>): Promise<Customer | null> {
    await this.repository.update(id, data);
    const customer = await this.findById(id);
    return customer;
  }
}
