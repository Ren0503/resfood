import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Auth } from 'auth/auth.decorator';
import { Role } from 'auth/role.decorator';
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
import { RestaurantService } from './restaurant.service';

@Resolver()
export class RestaurantResolver {
    constructor(private readonly restaurantService: RestaurantService) { }

    @Query(() => GetAllRestaurantsOutput)
    getAllRestaurants(
        @Args('input') getAllRestaurants: GetAllRestaurantsInput,
    ): Promise<GetAllRestaurantsOutput> {
        return this.restaurantService.getAllRestaurants(getAllRestaurants);
    }

    @Query(() => GetRestaurantOutput)
    getRestaurant(
        @Args('input') restaurantInput: GetRestaurantInput,
    ): Promise<GetRestaurantOutput> {
        return this.restaurantService.getRestaurant(restaurantInput);
    }

    @Query(() => SearchRestaurantOutput)
    searchRestaurant(
        @Args('input') searchRestaurantInput: SearchRestaurantInput,
    ): Promise<SearchRestaurantOutput> {
        return this.restaurantService.searchRestaurant(searchRestaurantInput);
    }

    @Mutation(() => CreateRestaurantOutput)
    @Role(['Owner'])
    createRestaurant(
        @Auth() authUser: User,
        @Args('input') createRestaurantInput: CreateRestaurantInput,
    ): Promise<CreateRestaurantOutput> {
        return this.restaurantService.createRestaurant(
            authUser,
            createRestaurantInput,
        );
    }

    @Mutation(() => EditRestaurantOutput)
    @Role(['Owner'])
    editRestaurant(
        @Auth() authUser: User,
        @Args('input') editRestaurantInput: EditRestaurantInput,
    ): Promise<EditRestaurantOutput> {
        return this.restaurantService.editRestaurant(
            authUser,
            editRestaurantInput,
        );
    }

    @Mutation(() => DeleteRestaurantOutput)
    @Role(['Owner'])
    deleteRestaurant(
        @Auth() authUser: User,
        @Args('input') deleteRestaurantInput: DeleteRestaurantInput,
    ): Promise<DeleteRestaurantOutput> {
        return this.restaurantService.deleteRestaurant(
            authUser,
            deleteRestaurantInput,
        );
    }
}

@Resolver(() => Category)
export class CategoryResolver {
    constructor(private readonly restaurantsService: RestaurantService) { }

    @ResolveField(() => Number)
    countRestaurants(@Parent() category: Category): Promise<number> {
        return this.restaurantsService.countRestaurants(category);
    }

    @Query(() => GetAllCategoriesOutput)
    getAllCategories(): Promise<GetAllCategoriesOutput> {
        return this.restaurantsService.getAllCategories();
    }

    @Query(() => GetCategoryOutput)
    getCategoryBySlug(
        @Args('input') categoryInput: GetCategoryInput,
    ): Promise<GetCategoryOutput> {
        return this.restaurantsService.getCategoryBySlug(categoryInput);
    }
}

@Resolver(() => Dish)
export class DishResolver {
    constructor(private readonly restaurantsService: RestaurantService) { }

    @Mutation(() => CreateDishOutput)
    @Role(['Owner'])
    createDish(
        @Auth() authUser: User,
        @Args('input') createDishInput: CreateDishInput,
    ): Promise<CreateDishOutput> {
        return this.restaurantsService.createDish(authUser, createDishInput);
    }

    @Mutation(() => EditDishOutput)
    @Role(['Owner'])
    editDish(
        @Auth() authUser: User,
        @Args('input') editDishInput: EditDishInput,
    ): Promise<EditDishOutput> {
        return this.restaurantsService.editDish(authUser, editDishInput);
    }

    @Mutation(() => DeleteDishOutput)
    @Role(['Owner'])
    deleteDish(
        @Auth() authUser: User,
        @Args('input') deleteDishInput: DeleteDishInput,
    ): Promise<DeleteDishOutput> {
        return this.restaurantsService.deleteDish(authUser, deleteDishInput);
    }
}