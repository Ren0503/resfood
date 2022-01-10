import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsString } from 'class-validator';
import { CoreEntity } from 'core/entities/core.entity';
import { Restaurant } from 'restaurant/entities/restaurant.entity';
import { User } from 'user/entities/user.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';

@InputType('PaymentInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Payment extends CoreEntity {
    @Field(() => String)
    @Column()
    @IsString()
    transactionId: string;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.payments)
    user: User;

    @RelationId((payment: Payment) => payment.user)
    @IsNumber()
    userId: number;

    @Field(() => Restaurant)
    @ManyToOne(() => Restaurant)
    restaurant: Restaurant;

    @Field(() => Number)
    @RelationId((payment: Payment) => payment.restaurant)
    @IsNumber()
    restaurantId: number;
}
