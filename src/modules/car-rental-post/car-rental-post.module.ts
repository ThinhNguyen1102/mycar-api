import {Module} from '@nestjs/common'
import {CarRentalPostController} from './car-rental-post.controller'
import {CarRentalPostService} from './car-rental-post.service'
import {TypeOrmModule} from '@nestjs/typeorm'
import {CarRentalPost} from 'src/entities/car-rental-post.entity'

@Module({
  imports: [TypeOrmModule.forFeature([CarRentalPost])],
  controllers: [CarRentalPostController],
  providers: [CarRentalPostService],
})
export class CarRentaPostModule {}
