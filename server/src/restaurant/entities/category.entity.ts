import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';
import { CoreEntity } from 'core/entities/core.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Restaurant } from './restaurant.entity';

@InputType('CategoryInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Category extends CoreEntity {
    @Field(() => String)
    @Column({ unique: true })
    @IsString()
    name: string;

    @Field(() => String, { nullable: true })
    @Column({ nullable: true })
    @IsString()
    @IsOptional()
    coverImage?: string;

    @Field(() => String)
    @Column({ unique: true })
    @IsString()
    slug: string;

    @Field(() => [Restaurant])
    @OneToMany(() => Restaurant, (restaurant) => restaurant.category)
    restaurants: Restaurant[];
}
