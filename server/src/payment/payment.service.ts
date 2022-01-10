import { Injectable } from '@nestjs/common';
import { Interval, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Restaurant } from 'restaurant/entities/restaurant.entity';
import { LessThan, Repository } from 'typeorm';
import { User } from 'user/entities/user.entity';
import { CreatePaymentInput, CreatePaymentOutput } from './dtos/createPayment.dto';
import { GetPaymentOutput } from './dtos/getPayment.dto';
import { Payment } from './entities/payment.entities';

@Injectable()
export class PaymentService {
    constructor(
        @InjectRepository(Payment) private readonly payment: Repository<Payment>,
        @InjectRepository(Restaurant)
        private readonly restaurant: Repository<Restaurant>,
        private schedulerRegistry: SchedulerRegistry,
    ) { }

    async getPayments(user: User): Promise<GetPaymentOutput> {
        try {
            const foundPayments = await this.payment.find({ user });

            if (!foundPayments) {
                return { ok: false, error: 'Not Found Payment.' };
            }

            return {
                ok: true,
                error: 'Get Payments Successful.',
                payments: foundPayments,
            };
        } catch (error) {
            console.log('getPayments error');
            return { ok: false, error: 'Something went wrong.' };
        }
    }

    async createPayment(
        owner: User,
        createPaymentInput: CreatePaymentInput,
    ): Promise<CreatePaymentOutput> {
        try {
            const { transactionId, restaurantId } = createPaymentInput;
            const foundRestaurant = await this.restaurant.findOne({
                id: restaurantId,
            });

            if (!foundRestaurant) {
                return { ok: false, error: 'Not Found Restaurant.' };
            }

            if (foundRestaurant.ownerId !== owner.id) {
                return { ok: false, error: 'Not Authorization.' };
            }

            const date = new Date();
            date.setDate(date.getDate() + 7);
            foundRestaurant.isPromoted = true;
            foundRestaurant.promotedUntil = date;
            this.restaurant.save(foundRestaurant);

            const createdPayment = this.payment.create({
                transactionId: transactionId,
                user: owner,
                restaurant: foundRestaurant,
            });
            await this.payment.save(createdPayment);

            return { ok: true, error: 'Create Successful.' };
        } catch (error) {
            console.log('createPayment error');
            return { ok: false, error: 'Something went wrong.' };
        }
    }

    @Interval(30000)
    async checkPromotedRestaurants(): Promise<void> {
        const foundRestaurant = await this.restaurant.find({
            isPromoted: true,
            promotedUntil: LessThan(new Date()),
        });

        foundRestaurant.forEach(async (restaurant) => {
            restaurant.isPromoted = false;
            restaurant.promotedUntil = null;
            await this.restaurant.save(foundRestaurant);
        });
    }
}
