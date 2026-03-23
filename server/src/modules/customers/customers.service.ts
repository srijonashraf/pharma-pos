import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CustomersRepository } from './customers.repository';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerSearchDto } from './dto/customer-search.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly repository: CustomersRepository) {}

  async findAll(filter: CustomerSearchDto) {
    return this.repository.findWithFilter(filter);
  }

  async findOne(id: string) {
    const customer = await this.repository.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto) {
    const customer = await this.repository.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    if (dto.phone && dto.phone !== customer.phone) {
      const existing = await this.repository.findByPhone(dto.phone);
      if (existing) {
        throw new BadRequestException(
          `Customer with phone ${dto.phone} already exists`,
        );
      }
    }
    return this.repository.update(id, dto);
  }

  async create(dto: CreateCustomerDto) {
    if (dto.phone) {
      const existing = await this.repository.findByPhone(dto.phone);
      if (existing) {
        throw new BadRequestException(
          `Customer with phone ${dto.phone} already exists`,
        );
      }
    }
    return this.repository.create(dto);
  }
}
