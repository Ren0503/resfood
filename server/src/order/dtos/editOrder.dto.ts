import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'core/dtos/core.output';
import { Order } from 'order/entities/order.entity';

@InputType()
export class EditOrderInput extends PickType(Order, ['id', 'status']) {}

@ObjectType()
export class EditOrderOutput extends CoreOutput {}
