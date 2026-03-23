import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { MedicinesService } from './medicines.service';
import { MedicineFilterDto } from './dto/medicine-filter.dto';
import { CreateMedicineDto } from './dto/create-medicine.dto';
import { UpdateMedicineDto } from './dto/update-medicine.dto';

@Controller('medicines')
export class MedicinesController {
  constructor(private readonly service: MedicinesService) {}

  @Get()
  findAll(@Query() filter: MedicineFilterDto) {
    return this.service.findAll(filter);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateMedicineDto) {
    return this.service.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMedicineDto,
  ) {
    return this.service.update(id, dto);
  }
}
