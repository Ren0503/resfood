import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { v4 as uuidv4 } from 'uuid';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { CoreEntity } from 'core/entities/core.entity';

@InputType('VerificationInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
    @Field(() => String)
    @Column()
    @IsString()
    code: string;

    @OneToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn()
    user: User;

    @BeforeInsert()
    async createCode(): Promise<void> {
        const uuidValue = uuidv4();
        this.code = uuidValue.split('-')[0];
    }
}
