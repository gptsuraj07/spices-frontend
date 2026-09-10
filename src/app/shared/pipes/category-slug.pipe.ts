import { Pipe, PipeTransform } from '@angular/core';
import { CATEGORIES } from '../../core/data/categories.mock';
import { Category } from '../../core/models';

@Pipe({
  name: 'categorySlug',
  standalone: false
})
export class CategorySlugPipe implements PipeTransform {
  transform(categoryId: string | null | undefined): string {
    if (!categoryId) return 'rasam';
    const category = CATEGORIES.find((c: Category) => c.id === categoryId);
    return category ? category.slug : 'rasam';
  }
}
