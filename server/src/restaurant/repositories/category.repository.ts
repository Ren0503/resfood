import { EntityRepository, Repository } from 'typeorm';
import { Category } from 'restaurant/entities/category.entity';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
    async handleCreateCategory(name: string): Promise<Category> {
        const categoryName: string = name.trim().toLowerCase().replace(/ +/g, ' ');
        const categorySlug: string = categoryName.replace(/ /g, '-');
        let category: Category = await this.findOne({ slug: categorySlug });

        if (!category) {
            category = this.create({
                name: categoryName,
                slug: categorySlug,
            });
            await this.save(category);
        }
        return category;
    }
}