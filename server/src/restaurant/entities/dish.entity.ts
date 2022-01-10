import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { CoreEntity } from 'core/entities/core.entity';
import { Column, Entity, ManyToOne, RelationId } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@InputType('DishChoiceInputType', { isAbstract: true })
@ObjectType()
export class DishChoice {
    @Field(() => String)
    @IsString()
    name: string;

    @Field(() => Number, { nullable: true })
    @IsNumber()
    @IsOptional()
    extra?: number;
}

@InputType('DishOptionInputType', { isAbstract: true })
@ObjectType()
export class DishOption {
    @Field(() => String)
    @IsString()
    name: string;

    @Field(() => [DishChoice], { nullable: true })
    @IsOptional()
    choices?: DishChoice[];

    @Field(() => Number, { nullable: true })
    @IsNumber()
    @IsOptional()
    extra?: number;
}

@InputType('DishInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Dish extends CoreEntity {
    @Field(() => String)
    @Column({ unique: true })
    @IsString()
    name: string;

    @Field(() => Number, { nullable: true })
    @Column({ nullable: true })
    @IsNumber()
    @IsOptional()
    price?: number;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    photo?: string;

    @Field(() => String)
    @Column()
    @IsString()
    @Length(0, 100)
    description: string;

    @Field(() => Restaurant)
    @ManyToOne(() => Restaurant, (restaurant) => restaurant.dishes, {
        onDelete: 'CASCADE',
    })
    restaurant: Restaurant;

    @RelationId((dish: Dish) => dish.restaurant)
    @IsNumber()
    restaurantId: number;

    @Field(() => [DishOption], { nullable: true })
    @Column({ type: 'json', nullable: true })
    @IsOptional()
    options?: DishOption[];
}
