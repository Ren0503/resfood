import { Inject } from '@nestjs/common';
import { Args, Resolver, Query, Mutation, Subscription } from '@nestjs/graphql';
import { Auth } from 'auth/auth.decorator';
import { Role } from 'auth/role.decorator';
import { NEW_COOKED_ORDER, NEW_ORDER_UPDATE, NEW_PENDING_ORDER } from 'core/core.constants';
import { PubSub } from 'graphql-subscriptions';
import { User } from 'user/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/createOrder.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/editOrder.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/getOrder.dto';
import { GetOrdersInput, GetOrdersOutput } from './dtos/getOrders';
import { TakeOrderInput, TakeOrderOutput } from './dtos/takeOrder.dto';
import { UpdateOrderInput } from './dtos/updateOrder.dto';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';

@Resolver()
export class OrderResolver {
    constructor(
        private readonly orderService: OrderService,
        @Inject('PUB_SUB') private readonly pubsub: PubSub,
    ) { }

    @Query(() => GetOrdersOutput)
    @Role(['Any'])
    getOrders(
        @Auth() user: User,
        @Args('input') getOrdersInput: GetOrdersInput
    ): Promise<GetOrdersOutput> {
        return this.orderService.getOrders(user, getOrdersInput);
    }

    @Query(() => GetOrderOutput)
    @Role(['Any'])
    getOrder(
        @Auth() user: User,
        @Args('input') getOrderInput: GetOrderInput,
    ): Promise<GetOrderOutput> {
        return this.orderService.getOrder(user, getOrderInput);
    }

    @Mutation(() => CreateOrderOutput)
    @Role(['Any'])
    createOrder(
        @Auth() customer: User,
        @Args('input') createOrderInput: CreateOrderInput,
    ): Promise<CreateOrderOutput> {
        return this.orderService.createOrder(customer, createOrderInput);
    }

    @Mutation(() => EditOrderOutput)
    @Role(['Any'])
    editOrder(
        @Auth() user: User,
        @Args('input') editOrderInput: EditOrderInput,
    ): Promise<EditOrderOutput> {
        return this.orderService.editOrder(user, editOrderInput);
    }

    @Mutation(() => TakeOrderOutput)
    @Role(['Any'])
    takeOrder(
        @Auth() driver: User,
        @Args('input') takeOrderInput: TakeOrderInput,
    ): Promise<TakeOrderOutput> {
        return this.orderService.takeOrder(driver, takeOrderInput);
    }

    @Subscription(() => Order, {
        filter: (payload, variables, context): boolean => {
            const {
                pendingOrders: { ownerId },
            } = payload;
            const { user } = context;

            if (ownerId === user.user.id) {
                return true;
            }

            return false;
        },
        resolve: (payload) => {
            const {
                pendingOrders: { savedOrder },
            } = payload;

            return savedOrder;
        },
    })

    @Role(['Any'])
    pendingOrders() {
        return this.pubsub.asyncIterator(NEW_PENDING_ORDER);
    }

    @Subscription(() => Order)
    @Role(['Any'])
    cookedOrders() {
        return this.pubsub.asyncIterator(NEW_COOKED_ORDER);
    }

    @Subscription(() => Order, {
        filter: (payload, variables, context) => {
            const { orderUpdates } = payload;
            const {
                input: { id },
            } = variables;
            const {
                user: { user },
            } = context;

            if (
                orderUpdates.driverId !== user.id &&
                orderUpdates.customerId !== user.id &&
                orderUpdates.restaurant.ownerId !== user.id
            ) {
                return false;
            }

            if (orderUpdates.id === id) {
                return true;
            }

            return false;
        },
    })
    @Role(['Any'])
    orderUpdates(@Args('input') orderUpdatesInput: UpdateOrderInput) {
        return this.pubsub.asyncIterator(NEW_ORDER_UPDATE);
    }
}
