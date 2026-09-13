import { Component, OnInit } from '@angular/core';
import { Product } from '../../core/models';
import { ProductService } from '../../core/services/product.service';
import { ImageCompressionService } from '../../core/services/image-compression.service';
import { ToastService } from '../../core/services/toast.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-products',
  standalone: false,
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  filtered: Product[] = [];
  loading = true;

  searchQuery = '';
  filterStatus = 'all';

  deleteConfirmId: string | null = null;

  // Modal State (Edit or Create New)
  isCreatingNew = false;
  editingProduct: Product | null = null;
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  uploading = false;
  uploadProgressText = '';

  // Recipe Form State
  recipeTitle = '';
  recipePrepTime = '';
  recipeCookTime = '';
  recipeServings = '';
  recipeIngredientsText = '';
  recipeInstructionsText = '';
  recipeTips = '';

  constructor(
    private productService: ProductService,
    private imageCompressionService: ImageCompressionService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.productService.getAll().subscribe(products => {
      this.products = products;
      this.applyFilter();
      this.loading = false;
    });
  }

  applyFilter(): void {
    let result = [...this.products];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.sku?.toLowerCase().includes(q)
      );
    }
    if (this.filterStatus !== 'all') {
      result = result.filter(p => p.status === this.filterStatus);
    }
    this.filtered = result;
  }

  // Image framing & focus state
  imagePositionX = 50;
  imagePositionY = 50;
  imageFit: 'contain' | 'cover' = 'contain';
  imageScale = 1.0;

  parseImageFraming(product: Product): void {
    this.imageFit = product.imageFit === 'cover' ? 'cover' : 'contain';
    this.imageScale = product.imageScale || 1.0;

    const pos = product.imagePosition || '50% 50%';
    if (pos.includes('%')) {
      const parts = pos.split(' ').map(p => parseFloat(p.replace('%', '')));
      if (parts.length >= 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
        this.imagePositionX = parts[0];
        this.imagePositionY = parts[1];
        return;
      }
    }

    if (pos.includes('top')) this.imagePositionY = 0;
    else if (pos.includes('bottom')) this.imagePositionY = 100;
    else this.imagePositionY = 50;

    if (pos.includes('left')) this.imagePositionX = 0;
    else if (pos.includes('right')) this.imagePositionX = 100;
    else this.imagePositionX = 50;
  }

  updateImageFraming(): void {
    if (!this.editingProduct) return;
    this.editingProduct.imagePosition = `${this.imagePositionX}% ${this.imagePositionY}%`;
    this.editingProduct.imageFit = this.imageFit;
    this.editingProduct.imageScale = this.imageScale;
  }

  setImagePreset(preset: 'top' | 'center' | 'bottom' | 'left' | 'right'): void {
    if (preset === 'top') { this.imagePositionX = 50; this.imagePositionY = 0; }
    else if (preset === 'bottom') { this.imagePositionX = 50; this.imagePositionY = 100; }
    else if (preset === 'left') { this.imagePositionX = 0; this.imagePositionY = 50; }
    else if (preset === 'right') { this.imagePositionX = 100; this.imagePositionY = 50; }
    else { this.imagePositionX = 50; this.imagePositionY = 50; }
    this.updateImageFraming();
  }

  openAddModal(): void {
    this.isCreatingNew = true;
    this.editingProduct = {
      id: '',
      name: '',
      slug: '',
      subtitle: '',
      categoryId: 'cat-kozhambu',
      categorySlug: 'kozhambu',
      description: '',
      shortDescription: '',
      price: 100,
      originalPrice: 120,
      compareAtPrice: 120,
      weight: 100,
      weightUnit: 'g',
      sku: '',
      stock: 50,
      inStock: true,
      imageUrl: null,
      imagePosition: '50% 50%',
      imageFit: 'contain',
      imageScale: 1.0,
      gallery: [],
      status: 'active',
      featured: false,
      badge: null,
      ingredients: null,
      usage: null,
      storage: null,
      recipe: null,
      tags: [],
      rating: 5,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.previewUrl = null;
    this.selectedFile = null;
    this.uploading = false;
    this.uploadProgressText = '';
    this.parseImageFraming(this.editingProduct);

    this.recipeTitle = '';
    this.recipePrepTime = '';
    this.recipeCookTime = '';
    this.recipeServings = '';
    this.recipeIngredientsText = '';
    this.recipeInstructionsText = '';
    this.recipeTips = '';
  }

  openEditModal(product: Product): void {
    this.isCreatingNew = false;
    this.editingProduct = { ...product };
    if (this.editingProduct.imageUrl && !this.editingProduct.imageUrl.trim()) {
      this.editingProduct.imageUrl = null;
    }
    this.previewUrl = null;
    this.selectedFile = null;
    this.uploading = false;
    this.uploadProgressText = '';
    this.parseImageFraming(this.editingProduct);

    // Initialize recipe form
    if (this.editingProduct.recipe) {
      this.recipeTitle = this.editingProduct.recipe.title || '';
      this.recipePrepTime = this.editingProduct.recipe.prepTime || '';
      this.recipeCookTime = this.editingProduct.recipe.cookTime || '';
      this.recipeServings = this.editingProduct.recipe.servings || '';
      this.recipeIngredientsText = (this.editingProduct.recipe.ingredients || []).join('\n');
      this.recipeInstructionsText = (this.editingProduct.recipe.instructions || []).join('\n');
      this.recipeTips = this.editingProduct.recipe.tips || '';
    } else {
      this.recipeTitle = '';
      this.recipePrepTime = '';
      this.recipeCookTime = '';
      this.recipeServings = '';
      this.recipeIngredientsText = '';
      this.recipeInstructionsText = '';
      this.recipeTips = '';
    }
  }

  closeEditModal(): void {
    this.isCreatingNew = false;
    this.editingProduct = null;
    this.previewUrl = null;
    this.selectedFile = null;
    this.uploading = false;
    this.uploadProgressText = '';
  }

  triggerFileInput(input: HTMLInputElement): void {
    input.value = '';
    input.click();
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0 || !this.editingProduct) return;

    const file = input.files[0];

    // Validate file type
    if (!file.type.startsWith('image/')) {
      this.toastService.error('Unsupported file type. Please select a valid image file (JPEG, PNG, WebP, etc.).');
      return;
    }

    // Step 1: Immediate local preview
    try {
      this.selectedFile = file;
      this.previewUrl = await this.imageCompressionService.generatePreview(file);
    } catch (err) {
      this.toastService.error('Could not load image preview.');
      return;
    }

    // Step 2-5: Compress image (WebP, max 1600px)
    this.uploading = true;
    this.uploadProgressText = 'Compressing image (WebP, max 1600px)...';

    try {
      const compressedFile = await this.imageCompressionService.compressImage(file, 1600, 0.82);

      // Step 7-8: Upload compressed file to R2 via backend
      this.uploadProgressText = 'Uploading to Cloudflare R2...';
      const prodId = this.editingProduct.id || (this.editingProduct as any)._id;

      this.productService.uploadProductImage(prodId, compressedFile).subscribe({
        next: (updatedProduct: Product) => {
          this.editingProduct!.imageUrl = updatedProduct.imageUrl;
          this.updateProductInList(updatedProduct);
          this.previewUrl = null;
          this.selectedFile = null;
          this.uploading = false;
          this.uploadProgressText = '';
          this.toastService.success('Product image uploaded and saved to R2!');
        },
        error: (err) => {
          this.uploading = false;
          this.uploadProgressText = '';
          this.previewUrl = null;
          this.selectedFile = null;
          const msg = err.error?.detail || err.message || 'Product image upload failed.';
          this.toastService.error(msg);
        }
      });
    } catch (err: any) {
      this.uploading = false;
      this.uploadProgressText = '';
      this.previewUrl = null;
      this.selectedFile = null;
      this.toastService.error(err.message || 'Image compression failed.');
    }
  }

  onRemoveImage(): void {
    if (!this.editingProduct) return;

    const prodId = this.editingProduct.id || (this.editingProduct as any)._id;
    this.uploading = true;
    this.uploadProgressText = 'Removing image from R2...';

    this.productService.removeProductImage(prodId).subscribe({
      next: (updatedProduct: Product) => {
        this.editingProduct!.imageUrl = null;
        this.updateProductInList(updatedProduct);
        this.previewUrl = null;
        this.selectedFile = null;
        this.uploading = false;
        this.uploadProgressText = '';
        this.toastService.success('Product image removed successfully!');
      },
      error: (err) => {
        this.uploading = false;
        this.uploadProgressText = '';
        const msg = err.error?.detail || err.message || 'Failed to remove image.';
        this.toastService.error(msg);
      }
    });
  }

  onSave(): void {
    if (!this.editingProduct) return;

    // Ensure categorySlug is synchronized with categoryId
    const catSlugMap: Record<string, string> = {
      'cat-kozhambu': 'kozhambu',
      'cat-rasam': 'rasam',
      'cat-sambar': 'sambar',
      'cat-tiffin': 'tiffin-mixes',
      'cat-combos': 'combos'
    };
    if (this.editingProduct.categoryId) {
      this.editingProduct.categorySlug = catSlugMap[this.editingProduct.categoryId] || this.editingProduct.categoryId.replace('cat-', '');
    }

    // Process recipe inputs (all fields optional)
    const ingredientsArray = this.recipeIngredientsText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const instructionsArray = this.recipeInstructionsText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const hasAnyRecipeField =
      !!this.recipeTitle.trim() ||
      !!this.recipePrepTime.trim() ||
      !!this.recipeCookTime.trim() ||
      !!this.recipeServings.trim() ||
      !!this.recipeTips.trim() ||
      ingredientsArray.length > 0 ||
      instructionsArray.length > 0;

    if (hasAnyRecipeField) {
      this.editingProduct.recipe = {
        title: this.recipeTitle.trim() || undefined,
        prepTime: this.recipePrepTime.trim() || undefined,
        cookTime: this.recipeCookTime.trim() || undefined,
        servings: this.recipeServings.trim() || undefined,
        ingredients: ingredientsArray,
        instructions: instructionsArray,
        tips: this.recipeTips.trim() || undefined,
      };
    } else {
      this.editingProduct.recipe = null;
    }

    if (!this.editingProduct.name || !this.editingProduct.name.trim()) {
      this.toastService.error('Product Name is required.');
      return;
    }

    if (this.isCreatingNew) {
      this.uploading = true;
      this.uploadProgressText = 'Creating product...';

      this.productService.createProduct(this.editingProduct).subscribe({
        next: (createdProduct: Product) => {
          const prodId = createdProduct.id || (createdProduct as any)._id;

          if (this.selectedFile) {
            this.uploadProgressText = 'Uploading image to Cloudflare R2...';
            this.productService.uploadProductImage(prodId, this.selectedFile).subscribe({
              next: (finalProduct: Product) => {
                this.products.unshift(finalProduct);
                this.applyFilter();
                this.uploading = false;
                this.uploadProgressText = '';
                this.toastService.success('New product & image created successfully!');
                this.closeEditModal();
              },
              error: () => {
                this.products.unshift(createdProduct);
                this.applyFilter();
                this.uploading = false;
                this.uploadProgressText = '';
                this.toastService.success('New product created successfully!');
                this.closeEditModal();
              }
            });
          } else {
            this.products.unshift(createdProduct);
            this.applyFilter();
            this.uploading = false;
            this.uploadProgressText = '';
            this.toastService.success('New product created successfully!');
            this.closeEditModal();
          }
        },
        error: (err) => {
          this.uploading = false;
          this.uploadProgressText = '';
          const msg = err.error?.detail || err.message || 'Failed to create product.';
          this.toastService.error(msg);
        }
      });
    } else {
      const prodId = this.editingProduct.id || (this.editingProduct as any)._id;
      this.uploading = true;
      this.uploadProgressText = 'Saving product details...';

      this.productService.updateProduct(prodId, this.editingProduct).subscribe({
        next: (updatedProduct: Product) => {
          this.updateProductInList(updatedProduct);
          this.uploading = false;
          this.uploadProgressText = '';
          this.toastService.success('Product details saved successfully!');
          this.closeEditModal();
        },
        error: (err) => {
          this.uploading = false;
          this.uploadProgressText = '';
          const msg = err.error?.detail || err.message || 'Failed to save product details.';
          this.toastService.error(msg);
        }
      });
    }
  }

  private updateProductInList(updatedProduct: Product): void {
    const targetId = updatedProduct.id || (updatedProduct as any)._id;
    const index = this.products.findIndex(p => p.id === targetId || (p as any)._id === targetId);
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedProduct };
      this.applyFilter();
    }
  }

  getImageUrl(url: string | null | undefined): string | null {
    if (!url || !url.trim()) return null;
    if (url.startsWith('/')) {
      const base = environment.apiUrl.replace(/\/api\/?$/, '');
      return `${base}${url}`;
    }
    return url;
  }

  confirmDelete(id: string): void {
    this.deleteConfirmId = id;
  }

  cancelDelete(): void {
    this.deleteConfirmId = null;
  }

  doDelete(id: string): void {
    this.productService.deleteProduct(id).subscribe(() => {
      this.products = this.products.filter(p => p.id !== id && (p as any)._id !== id);
      this.applyFilter();
      this.deleteConfirmId = null;
    });
  }

  getStatusClass(status: string): string {
    const m: Record<string, string> = {
      active: 'badge--green',
      inactive: 'badge--gray',
      out_of_stock: 'badge--red',
    };
    return m[status] ?? 'badge--gray';
  }

  getStockClass(stock: number): string {
    if (stock === 0) return 'stock--empty';
    if (stock <= 5) return 'stock--low';
    return 'stock--ok';
  }

  getCategoryName(catId: string | undefined): string {
    if (!catId) return 'General';
    const map: Record<string, string> = {
      'cat-kozhambu': 'Kuzhambu',
      'cat-rasam': 'Rasam',
      'cat-sambar': 'Sambar',
      'cat-tiffin': 'Tiffin Mixes & Podis',
      'cat-combos': 'Heritage Combos'
    };
    return map[catId] || catId;
  }
}

