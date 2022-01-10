import {
    Field,
    InputType,
    ObjectType,
    registerEnumType,
} from '@nestjs/graphql';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { CoreEntity } from 'core/entities/core.entity';
import { Restaurant } from 'restaurant/entities/restaurant.entity';
import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne,
    RelationId,
} from 'typeorm';
import { User } from 'user/entities/user.entity';
import { OrderItem } from './orderItem.entity';

export enum OrderStatus {
    Pending = 'Pending',
    Cooking = 'Cooking',
    Cooked = 'Cooked',
    PickedUp = 'PickedUp',
    Delivered = 'Delivered',
}

registerEnumType(OrderStatus, { name: 'OrderStatus' });

@InputType('OrderInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Order extends CoreEntity {
    @Field(() => User, { nullable: true })
    @ManyToOne(() => User, (user) => user.orders, {
        onDelete: 'SET NULL',
        nullable: true,
        eager: true,
    })
    @IsOptional()
    customer?: User;

    @RelationId((order: Order) => order.customer)
    @IsNumber()
    customerId: number;

    @Field(() => User, { nullable: true })
    @ManyToOne(() => User, (user) => user.rides, {
        onDelete: 'SET NULL',
        nullable: true,
        eager: true,
    })
    @IsOptional()
    driver?: User;

    @RelationId((order: Order) => order.driver)
    @IsNumber()
    driverId: number;

    @Field(() => Restaurant, { nullable: true })
    @ManyToOne(() => Restaurant, (restaurant) => restaurant.orders, {
        onDelete: 'SET NULL',
        nullable: true,
        eager: true,
    })
    @IsOptional()
    restaurant?: Restaurant;

    @Field(() => [OrderItem])
    @ManyToMany(() => OrderItem, { eager: true })
    @JoinTable()
    items: OrderItem[];

    @Field(() => Number, { nullable: true })
    @Column({ nullable: true })
    @IsNumber()
    @IsOptional()
    totalPrice?: number;

    @Field(() => OrderStatus)
    @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.Pending })
    @IsEnum(OrderStatus)
    status: OrderStatus;
}
