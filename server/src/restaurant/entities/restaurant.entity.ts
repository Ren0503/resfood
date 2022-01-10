import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'core/entities/core.entity';
import { Order } from 'order/entities/order.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { User } from 'user/entities/user.entity';
import { Category } from './category.entity';
import { Dish } from './dish.entity';

@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
    @Field(() => String)
    @Column()
    @IsString()
    name: string;

    @Field(() => String)
    @Column()
    @IsString()
    coverImage: string;

    @Field(() => String)
    @Column()
    @IsString()
    address: string;

    @Field(() => Category, { nullable: true })
    @ManyToOne(() => Category, (category) => category.restaurants, {
        nullable: true,
        onDelete: 'SET NULL',
    })
    @IsOptional()
    category?: Category;

    @Field(() => User)
    @ManyToOne(() => User, (user) => user.restaurants, { onDelete: 'CASCADE' })
    owner: User;

    @RelationId((restaurant: Restaurant) => restaurant.owner)
    @IsNumber()
    ownerId: number;

    @Field(() => [Dish])
    @OneToMany(() => Dish, (dish) => dish.restaurant)
    dishes: Dish[];

    @Field(() => [Order])
    @OneToMany(() => Order, (order) => order.restaurant)
    orders: Order[];

    @Field(() => Boolean)
    @Column({ default: false })
    @IsBoolean()
    isPromoted: boolean;

    @Field(() => Date, { nullable: true })
    @Column({ nullable: true })
    @IsOptional()
    promotedUntil: Date;
}