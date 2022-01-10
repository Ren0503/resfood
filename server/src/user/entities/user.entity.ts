import * as bcrypt from 'bcrypt';
import {
    Field,
    InputType,
    ObjectType,
    registerEnumType,
} from '@nestjs/graphql';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { CoreEntity } from 'core/entities/core.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { Restaurant } from 'restaurant/entities/restaurant.entity';

export enum UserRole {
    Client = 'Client',
    Owner = 'Owner',
    Delivery = 'Delivery',
}

registerEnumType(UserRole, { name: 'UserRole ' });

@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
    @Field(() => String)
    @Column({ unique: true })
    @IsEmail()
    email: string;

    @Field(() => String)
    @Column({ select: false })
    @IsString()
    password: string;

    @Field(() => UserRole)
    @Column({ type: 'enum', enum: UserRole })
    @IsEnum(UserRole)
    role: UserRole;

    @Field(() => Boolean)
    @Column({ default: false })
    @IsBoolean()
    emailVerification: boolean;

    @Field(() => [Restaurant])
    @OneToMany(() => Restaurant, (restaurant) => restaurant.owner)
    restaurants: Restaurant[];

    @BeforeInsert()
    @BeforeUpdate()
    async hashPassword(): Promise<void> {
        if (this.password !== undefined) {
            try {
                this.password = await bcrypt.hash(this.password, 10);
            } catch (error) {
                console.log('hashPassword error', error);
                throw new InternalServerErrorException();
            }
        }
    }

    async checkPassword(password: string): Promise<boolean> {
        try {
            const isCorrectPassword = await bcrypt.compare(password, this.password);
            return isCorrectPassword;
        } catch (error) {
            console.log('checkPassword error', error);
            throw new InternalServerErrorException();
        }
    }
}