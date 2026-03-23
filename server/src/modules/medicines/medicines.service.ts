import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MedicinesRepository } from './medicines.repository';
import { MedicineFilterDto } from './dto/medicine-filter.dto';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@Injectable()
export class MedicinesService {
  constructor(private readonly repository: MedicinesRepository) {}

  async findAll(filter: MedicineFilterDto) {
    return this.repository.findWithFilter(filter);
  }

  async findOne(id: string) {
    const medicine = await this.repository.findById(id);
    if (!medicine) {
      throw new NotFoundException(`Medicine with ID ${id} not found`);
    }
    return medicine;
  }

  async create(dto: CreateMedicineDto) {
    if (dto.barcode) {
      const existing = await this.repository.findByBarcode(dto.barcode);
      if (existing) {
        throw new ConflictException(
          `Medicine with barcode ${dto.barcode} already exists`,
        );
      }
    }
    return this.repository.create(dto);
  }

  async update(id: string, dto: UpdateMedicineDto) {
    const medicine = await this.repository.update(id, dto);
    if (!medicine) {
      throw new NotFoundException(`Medicine with ID ${id} not found`);
    }
    return medicine;
  }

  async findByIds(ids: string[]) {
    return this.repository.findByIds(ids);
  }
}
