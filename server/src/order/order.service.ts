import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NEW_COOKED_ORDER, NEW_ORDER_UPDATE, NEW_PENDING_ORDER } from 'core/core.constants';
import { PubSub } from 'graphql-subscriptions';
import { Dish } from 'restaurant/entities/dish.entity';
import { Restaurant } from 'restaurant/entities/restaurant.entity';
import { Repository } from 'typeorm';
import { User, UserRole } from 'user/entities/user.entity';
import { CreateOrderInput, CreateOrderOutput } from './dtos/createOrder.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/editOrder.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/getOrder.dto';
import { GetOrdersInput, GetOrdersOutput } from './dtos/getOrders';
import { TakeOrderInput, TakeOrderOutput } from './dtos/takeOrder.dto';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/orderItem.entity';

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private readonly orders: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItem: Repository<OrderItem>,
        @InjectRepository(Restaurant)
        private readonly restaurant: Repository<Restaurant>,
        @InjectRepository(Dish)
        private readonly dish: Repository<Dish>,
        @Inject('PUB_SUB') private readonly pubsub: PubSub,
    ) { }

    async getOrders(
        user: User,
        getOrdersInput: GetOrdersInput,
    ): Promise<GetOrdersOutput> {
        try {
            let foundOrders: Order[];
            const { role } = user;
            const { status } = getOrdersInput;

            if (role === UserRole.Client) {
                foundOrders = await this.orders.find({
                    where: { customer: user, ...(status && { status }) },
                });
            } else if (role === UserRole.Delivery) {
                foundOrders = await this.orders.find({
                    where: { driver: user, ...(status && { status }) },
                });
            } else if (role === UserRole.Owner) {
                const foundRestaurants = await this.restaurant.find({
                    where: { owner: user },
                    relations: ['orders'],
                });

                foundOrders = foundRestaurants
                    .map((restaurant) => restaurant.orders)
                    .flat(1);

                if (status) {
                    foundOrders = foundOrders.filter((order) => order.status === status);
                }
            }

            return {
                ok: true,
                error: 'Get Orders Successful.',
                orders: foundOrders,
            };
        } catch (error) {
            console.log('getOrders error');
            return {
                ok: false,
                error: 'Something went wrong.',
                orders: null,
            };
        }
    }

    async getOrder(
        user: User,
        getOrderInput: GetOrderInput,
    ): Promise<GetOrderOutput> {
        try {
            const { id } = getOrderInput;
            const foundOrder = await this.orders.findOne({
                where: { id },
                relations: ['restaurant'],
            });

            if (!foundOrder) {
                return {
                    ok: false,
                    error: 'Order Not Found.',
                    order: null,
                };
            }

            if (user.role === UserRole.Client && foundOrder.customerId !== user.id) {
                return {
                    ok: false,
                    error: 'Not Authorization.',
                    order: null,
                };
            }

            if (user.role === UserRole.Delivery && foundOrder.driverId !== user.id) {
                return {
                    ok: false,
                    error: 'Not Authorization.',
                    order: null,
                };
            }

            if (
                user.role === UserRole.Owner &&
                foundOrder.restaurant.ownerId !== user.id
            ) {
                return {
                    ok: false,
                    error: 'Not Authorization.',
                    order: null,
                };
            }

            return {
                ok: true,
                error: 'Found Order Successful.',
                order: foundOrder,
            };
        } catch (error) {
            console.log('getOrder error');
            return {
                ok: false,
                error: 'Something went wrong.',
                order: null,
            };
        }
    }

    async createOrder(
        customer: User,
        createOrderInput: CreateOrderInput,
    ): Promise<CreateOrderOutput> {
        try {
            let totalOrderPrice = 0;
            const orderItems: OrderItem[] = [];
            const { restaurantId, items } = createOrderInput;
            const foundRestaurant = await this.restaurant.findOne({
                id: restaurantId,
            });

            if (!foundRestaurant) {
                return { ok: false, error: 'Not Found Restaurant.' };
            }

            for (const item of items) {
                const { dishId, options } = item;
                const foundDish = await this.dish.findOne({ id: dishId });

                if (!foundDish) {
                    return { ok: false, error: 'Not Found Dish.' };
                }

                let totalDishPrice = foundDish.price;

                for (const itemOption of options) {
                    const foundDishOptions = foundDish.options.find(
                        (dishOption) => dishOption.name === itemOption.name,
                    );

                    if (foundDishOptions) {
                        if (foundDishOptions.extra) {
                            totalDishPrice = totalDishPrice + foundDishOptions.extra;
                        } else {
                            const foundDishOptionsChoice = foundDishOptions?.choices?.find(
                                (choice) => choice.name === itemOption.choice,
                            );

                            if (foundDishOptionsChoice) {
                                if (foundDishOptionsChoice.extra) {
                                    totalDishPrice =
                                        totalDishPrice + foundDishOptionsChoice.extra;
                                }
                            }
                        }
                    }
                }

                totalOrderPrice = totalOrderPrice + totalDishPrice;

                const createdOrderItem = this.orderItem.create({
                    dish: foundDish,
                    options,
                });
                const savedOrderItem = await this.orderItem.save(createdOrderItem);
                orderItems.push(savedOrderItem);
            }

            const createdOrder = await this.orders.create({
                customer,
                restaurant: foundRestaurant,
                totalPrice: totalOrderPrice,
                items: orderItems,
            });
            const savedOrder = await this.orders.save(createdOrder);

            await this.pubsub.publish(NEW_PENDING_ORDER, {
                pendingOrders: { savedOrder, ownerId: foundRestaurant.ownerId },
            });

            return { ok: true, error: 'Created Order Successful.' };
        } catch (error) {
            console.log('createOrder error');
            return { ok: false, error: 'Something went wrong.' };
        }
    }

    async editOrder(
        user: User,
        editOrderInput: EditOrderInput,
    ): Promise<EditOrderOutput> {
        try {
            const { id, status } = editOrderInput;
            const foundOrder = await this.orders.findOne({ id });

            if (user.role === UserRole.Client && foundOrder.customerId !== user.id) {
                return { ok: false, error: 'Not Authorization.' };
            }

            if (user.role === UserRole.Delivery && foundOrder.driverId !== user.id) {
                return { ok: false, error: 'Not Authorization.' };
            }

            if (
                user.role === UserRole.Owner &&
                foundOrder.restaurant.ownerId !== user.id
            ) {
                return { ok: false, error: 'Not Authorization.' };
            }

            if (!foundOrder) {
                return { ok: false, error: 'Not Found Order.' };
            }

            if (user.role === UserRole.Client) {
                return { ok: false, error: 'Not authorization.' };
            }

            if (user.role === UserRole.Owner) {
                if (status !== OrderStatus.Cooking && status !== OrderStatus.Cooked) {
                    return { ok: false, error: 'Not Authorization.' };
                }
            }

            if (user.role === UserRole.Delivery) {
                if (
                    status !== OrderStatus.PickedUp &&
                    status !== OrderStatus.Delivered
                ) {
                    return { ok: false, error: 'Not Authorization.' };
                }
            }

            await this.orders.save({ id, status });
            const newOrder = { ...foundOrder, status };

            if (user.role === UserRole.Owner) {
                if (status === OrderStatus.Cooked) {
                    await this.pubsub.publish(NEW_COOKED_ORDER, {
                        cookedOrders: newOrder,
                    });
                }
            }

            await this.pubsub.publish(NEW_ORDER_UPDATE, { orderUpdates: newOrder });
            return { ok: true, error: 'Updated Order Successful.' };
        } catch (error) {
            console.log('editOrder error');
            return { ok: false, error: 'Something went wrong.' };
        }
    }

    async takeOrder(
        driver: User,
        takeOrderInput: TakeOrderInput,
    ): Promise<TakeOrderOutput> {
        try {
            const { id } = takeOrderInput;
            const foundOrder = await this.orders.findOne({ id });

            if (!foundOrder) {
                return { ok: false, error: 'Order Not Found.' };
            }

            if (foundOrder.driver) {
                return { ok: false, error: 'Have ever driver.' };
            }

            await this.orders.save({ id: foundOrder.id, driver });
            await this.pubsub.publish(NEW_ORDER_UPDATE, {
                orderUpdates: { ...foundOrder, driver },
            });

            return { ok: true, error: 'Token order successful.' };
        } catch (error) {
            console.log('takeOrder error');
            return { ok: false, error: 'Something went wrong.' };
        }
    }
}
