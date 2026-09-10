import { Pipe, PipeTransform } from '@angular/core';
import { ALL_PRODUCTS } from '../../core/data/products.mock';

@Pipe({
  name: 'productName',
  standalone: false
})
export class ProductNamePipe implements PipeTransform {
  transform(productId: string): string {
    const product = ALL_PRODUCTS.find(p => p.id === productId);
    return product ? product.name : productId;
  }
}
