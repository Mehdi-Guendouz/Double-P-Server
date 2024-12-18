import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { History, HistorySchema } from 'src/history/schema/history.schema';
import { FunctionalitiesService } from './functionalities.service';
import { FunctionalitiesController } from './functionalities.controller';
import { UsersModule } from 'src/users/users.module';

// initialization of the module
@Module({
  imports: [
    MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }]),
    UsersModule,
  ],
  providers: [FunctionalitiesService],
  exports: [FunctionalitiesService],
  controllers: [FunctionalitiesController],
})
export class FunctionalitiesModule {}
