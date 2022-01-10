import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from 'user/entities/user.entity';
import { CreateDishInput, CreateDishOutput } from './dtos/createDish.dto';
import { CreateRestaurantInput, CreateRestaurantOutput } from './dtos/createRestaurant.dto';
import { DeleteDishInput, DeleteDishOutput } from './dtos/deleteDish.dto';
import { DeleteRestaurantInput, DeleteRestaurantOutput } from './dtos/deleteRestaurant.dto';
import { EditDishInput, EditDishOutput } from './dtos/editDish.dto';
import { EditRestaurantInput, EditRestaurantOutput } from './dtos/editRestaurant.dto';
import { GetAllCategoriesOutput } from './dtos/getAllCategories.dto';
import { GetAllRestaurantsInput, GetAllRestaurantsOutput } from './dtos/getAllRestaurants.dto';
import { GetCategoryInput, GetCategoryOutput } from './dtos/getCategory.dto';
import { GetRestaurantInput, GetRestaurantOutput } from './dtos/getRestaurant.dto';
import { SearchRestaurantInput, SearchRestaurantOutput } from './dtos/searchRestaurant.dto';
import { Category } from './entities/category.entity';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';

@Injectable()
export class RestaurantService {
    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurant: Repository<Restaurant>,
        @InjectRepository(Dish)
        private readonly dish: Repository<Dish>,
        private readonly category: CategoryRepository,
    ) { }

    async getAllRestaurants(
        getAllRestaurants: GetAllRestaurantsInput,
    ): Promise<GetAllRestaurantsOutput> {
        try {
            const { page } = getAllRestaurants;

            const [foundAllRestaurants, countedAllRestaurants] =
                await this.restaurant.findAndCount({
                    take: 5,
                    skip: (page - 1) * 5,
                    order: { isPromoted: 'DESC' },
                });

            return {
                ok: true,
                error: 'Get restaurants successful.',
                totalPages: Math.ceil(countedAllRestaurants / 5),
                totalResults: countedAllRestaurants,
                restaurants: foundAllRestaurants,
            };
        } catch (error) {
            console.log('getAllRestaurants error');
            return {
                ok: false,
                error: 'Something went wrong.',
                restaurants: null,
            };
        }
    }

    async getRestaurant(
        restaurantInput: GetRestaurantInput,
    ): Promise<GetRestaurantOutput> {
        try {
            const { restaurantId } = restaurantInput;
            const foundRestaurant = await this.restaurant.findOne(
                { id: restaurantId },
                { relations: ['dishes'] },
            );

            if (!foundRestaurant) {
                return {
                    ok: false,
                    error: 'Restaurant Not Found.',
                    restaurant: null,
                };
            }

            return {
                ok: true,
                error: 'Get Restaurant Successful.',
                restaurant: foundRestaurant,
            };
        } catch (error) {
            console.log('restaurantInput error');
            return {
                ok: false,
                error: 'Something went wrong.',
                restaurant: null,
            };
        }
    }

    async searchRestaurant(
        searchRestaurantInput: SearchRestaurantInput,
    ): Promise<SearchRestaurantOutput> {
        try {
            const { query, page } = searchRestaurantInput;

            const [foundAllRestaurants, countedAllRestaurants] =
                await this.restaurant.findAndCount({
                    where: { name: ILike(`%${query}%`) },
                    take: 5,
                    skip: (page - 1) * 5,
                });

            if (!foundAllRestaurants) {
                return {
                    ok: false,
                    error: 'Search Not Found.',
                    restaurants: null,
                    totalPages: 0,
                    totalResults: 0,
                };
            }

            return {
                ok: true,
                error: 'Search Successful.',
                restaurants: foundAllRestaurants,
                totalPages: Math.ceil(countedAllRestaurants / 5),
                totalResults: countedAllRestaurants,
            };
        } catch (error) {
            console.log('searchRestaurant error');
            return {
                ok: false,
                error: 'Something went wrong.',
                restaurants: null,
                totalPages: 0,
                totalResults: 0,
            };
        }
    }

    async createRestaurant(
        authUser: User,
        createRestaurantInput: CreateRestaurantInput,
    ): Promise<CreateRestaurantOutput> {
        try {
            const createdRestaurant = this.restaurant.create(createRestaurantInput);
            createdRestaurant.owner = authUser;
            const category = await this.category.handleCreateCategory(
                createRestaurantInput.categoryName,
            );

            createdRestaurant.category = category;
            await this.restaurant.save(createdRestaurant);
            return { ok: true, error: 'Created Successful.' };
        } catch (error) {
            console.log('createRestaurant error');
            return { ok: false, error: 'Something went wrong.' };
        }
    }

    async editRestaurant(
        authUser: User,
        editRestaurantInput: EditRestaurantInput,
    ): Promise<EditRestaurantOutput> {
        try {
            const { restaurantId, name, coverImage, address, categoryName } =
                editRestaurantInput;

            const foundRestaurant = await this.restaurant.findOne(restaurantId, {
                loadRelationIds: true,
            });

            if (!foundRestaurant) {
                return { ok: false, error: 'Not Found Restaurant.' };
            }

            if (authUser.id !== foundRestaurant.ownerId) {
                return { ok: false, error: 'Not Authorization.' };
            }

            let createdCategory: Category = null;
            if (categoryName) {
                createdCategory = await this.category.handleCreateCategory(
                    categoryName,
                );
            }

            await this.restaurant.save([
                {
                    id: restaurantId,
                    name,
                    coverImage,
                    address,
                    ...(categoryName && { category: createdCategory }),
                },
            ]);

            return { ok: true, error: 'Successful edited.' };
        } catch (error) {
            console.log('editRestaurant error');
            return { ok: false, error: 'Something went wrong.' };
        }
    }

    async deleteRestaurant(
        authUser: User,
        deleteRestaurantInput: DeleteRestaurantInput,
    ): Promise<DeleteRestaurantOutput> {
        try {
            const { restaurantId } = deleteRestaurantInput;
            const foundRestaurant = await this.restaurant.findOne(restaurantId);
            if (!foundRestaurant) {
                return { ok: false, error: 'Not found restaurant.' };
            }
            if (authUser.id !== foundRestaurant.ownerId) {
                return { ok: false, error: 'Not authorization.' };
            }
            await this.restaurant.delete({ id: foundRestaurant.id });
            return { ok: true, error: 'Deleted successful.' };
        } catch (error) {
            console.log('deleteRestaurant error');
            return { ok: false, error: 'Something went wrong.' };
        }
    }

    async countRestaurants(category: Category): Promise<number> {
        try {
            const countedRestaurants = await this.restaurant.count({ category });
            return countedRestaurants;
        } catch (error) {
            console.log('countRestaurants error');
            return 0;
        }
    }

    async getAllCategories(): Promise<GetAllCategoriesOutput> {
        try {
            const foundCategories = await this.category.find();
            if (!foundCategories) {
                return { ok: false, error: 'Not found categories.' };
            }
            return {
                ok: true,
                error: 'Get categories successful.',
                categories: foundCategories,
            };
        } catch (error) {
            console.log('getAllCategories error');
            return { ok: false, error: 'Something went wrong.' };
        }
    }

    async getCategoryBySlug(
        categoryInput: GetCategoryInput
    ): Promise<GetCategoryOutput> {
        try {
            const { slug, page } = categoryInput;
            const foundCategory = await this.category.findOne({ slug });

            if (!foundCategory) {
                return {
                    ok: false,
                    error: 'Not found category.',
                    category: null,
                };
            }

            const foundRestaurants = await this.restaurant.find({
                where: { category: foundCategory },
                take: 5,
                skip: (page - 1) * 5,
                order: { isPromoted: 'DESC' },
            });
            foundCategory.restaurants = foundRestaurants;

            const countedRestaurants = await this.restaurant.count({
                category: foundCategory,
            });

            return {
                ok: true,
                error: 'Get Category Successful.',
                totalPages: Math.ceil(countedRestaurants / 5),
                totalResults: countedRestaurants,
                category: foundCategory,
            };
        } catch (error) {
            console.log('getRestaurantsBySlug error');
            return {
                ok: false,
                error: 'Something went wrong.',
                category: null,
            };
        }
    }

    async createDish(
        authUser: User,
        createDishInput: CreateDishInput,
    ): Promise<CreateDishOutput> {
        try {
            const { restaurantId, name, price, description, options } =
                createDishInput;
            const foundRestaurant = await this.restaurant.findOne({
                id: restaurantId,
            });

            if (!foundRestaurant) {
                return { ok: false, error: 'Not found restaurant.' };
            }
            if (foundRestaurant.ownerId !== authUser.id) {
                return { ok: false, error: 'Not authorization.' };
            }

            const createdDish = this.dish.create({
                restaurantId,
                name,
                price,
                description,
                options,
                restaurant: foundRestaurant,
            });
            await this.dish.save(createdDish);
            return { ok: true, error: 'Created Dish Successful .' };
        } catch (error) {
            console.log('createDish error');
            return { ok: false, error: 'Something went wrong.' };
        }
    }

    async editDish(
        authUser: User,
        editDishInput: EditDishInput,
    ): Promise<EditDishOutput> {
        try {
            const { dishId, name, price, description, options } = editDishInput;
            const foundDish = await this.dish.findOne(
                { id: dishId },
                { relations: ['restaurant'] },
            );

            if (!foundDish) {
                return { ok: false, error: 'Not found dish.' };
            }
            if (authUser.id !== foundDish.restaurant.ownerId) {
                return { ok: false, error: 'Not authorization.' };
            }

            await this.dish.save([{ id: dishId, name, price, description, options }]);
            return { ok: true, error: 'Edit dish successful.' };
        } catch (error) {
            console.log('editDish error');
            return { ok: false, error: 'Something went wrong.' };
        }
    }

    // 음식(메뉴) 삭제
    async deleteDish(
        authUser: User,
        deleteDishInput: DeleteDishInput,
    ): Promise<DeleteDishOutput> {
        try {
            const { dishId } = deleteDishInput;
            const foundDish = await this.dish.findOne(
                { id: dishId },
                { relations: ['restaurant'] },
            );

            if (!foundDish) {
                return { ok: false, error: 'Not found dish.' };
            }
            if (authUser.id !== foundDish.restaurant.ownerId) {
                return { ok: false, error: 'Not authorization.' };
            }

            await this.dish.delete({ id: foundDish.id });
            return { ok: true, error: 'Deleted Dish Successful.' };
        } catch (error) {
            console.log('deleteDish error');
            return { ok: false, error: 'Something went wrong.' };
        }
    }
}
