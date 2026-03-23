import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medicine } from './entities/medicine.entity';
import { MedicinesController } from './medicines.controller';
import { MedicinesService } from './medicines.service';
import { MedicinesRepository } from './medicines.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Medicine])],
  controllers: [MedicinesController],
  providers: [MedicinesService, MedicinesRepository],
  exports: [MedicinesService, MedicinesRepository],
})
export class MedicinesModule {}
