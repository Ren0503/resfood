import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Auth } from 'auth/auth.decorator';
import { Role } from 'auth/role.decorator';
import { User } from 'user/entities/user.entity';
import { CreatePaymentInput, CreatePaymentOutput } from './dtos/createPayment.dto';
import { GetPaymentOutput } from './dtos/getPayment.dto';
import { PaymentService } from './payment.service';

@Resolver()
export class PaymentResolver {
    constructor(private readonly paymentService: PaymentService) { }

    @Query(() => GetPaymentOutput)
    @Role(['Any'])
    getPayments(@Auth() user: User): Promise<GetPaymentOutput> {
        return this.paymentService.getPayments(user);
    }

    @Mutation(() => CreatePaymentOutput)
    @Role(['Any'])
    createPayment(
        @Auth() owner: User,
        @Args('input') createPaymentInput: CreatePaymentInput,
    ): Promise<CreatePaymentOutput> {
        return this.paymentService.createPayment(owner, createPaymentInput);
    }
}
