import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medicine } from './entities/medicine.entity';
import { MedicineFilterDto } from './dto/medicine-filter.dto';
import { PaginatedResult } from '../../common/types/pagination.type';

@Injectable()
export class MedicinesRepository {
  constructor(
    @InjectRepository(Medicine)
    private readonly repository: Repository<Medicine>,
  ) {}

  async findWithFilter(
    filter: MedicineFilterDto,
  ): Promise<PaginatedResult<Medicine>> {
    const { search, brand, status, page = 1, limit = 20 } = filter;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('medicine');

    if (search) {
      queryBuilder.andWhere(
        '(medicine.name ILIKE :search OR medicine.genericName ILIKE :search OR medicine.barcode ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (brand) {
      queryBuilder.andWhere('medicine.brand ILIKE :brand', {
        brand: `%${brand}%`,
      });
    }

    if (status === 'in_stock') {
      queryBuilder.andWhere('medicine.stock > 0');
    } else if (status === 'out_of_stock') {
      queryBuilder.andWhere('medicine.stock <= 0');
    } else if (status === 'discounted') {
      queryBuilder.andWhere('medicine.discountPct > 0');
    }

    queryBuilder.andWhere('medicine.isActive = :isActive', { isActive: true });

    const [data, total] = await queryBuilder
      .orderBy('medicine.name', 'ASC')
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

  async findById(id: string): Promise<Medicine | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByBarcode(barcode: string): Promise<Medicine | null> {
    return this.repository.findOne({ where: { barcode } });
  }

  async create(data: Partial<Medicine>): Promise<Medicine> {
    const medicine = this.repository.create(data);
    return this.repository.save(medicine);
  }

  async update(id: string, data: Partial<Medicine>): Promise<Medicine | null> {
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async findByIds(ids: string[]): Promise<Medicine[]> {
    return this.repository.findByIds(ids);
  }
}
