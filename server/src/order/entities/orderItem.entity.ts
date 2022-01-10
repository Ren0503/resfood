import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'core/entities/core.entity';
import { Dish } from 'restaurant/entities/dish.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@InputType('OrderItemOptionInputType', { isAbstract: true })
@ObjectType()
export class OrderItemOption {
    @Field(() => String)
    name: string;

    @Field(() => String, { nullable: true })
    @IsString()
    @IsOptional()
    choice?: string;
}

@InputType('OrderItemInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class OrderItem extends CoreEntity {
    @Field(() => Dish)
    @ManyToOne(() => Dish, { nullable: true, onDelete: 'CASCADE' })
    dish: Dish;

    @Field(() => [OrderItemOption], { nullable: true })
    @Column({ type: 'json', nullable: true })
    @IsOptional()
    options?: OrderItemOption[];
}
