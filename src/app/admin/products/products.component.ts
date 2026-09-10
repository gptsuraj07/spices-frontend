import { Component, OnInit } from '@angular/core';
import { Product } from '../../core/models';
import { ProductService } from '../../core/services/product.service';
import { ImageCompressionService } from '../../core/services/image-compression.service';
import { ToastService } from '../../core/services/toast.service';

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

  // Image Management Modal State
  editingProduct: Product | null = null;
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  uploading = false;
  uploadProgressText = '';

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

  openEditModal(product: Product): void {
    this.editingProduct = { ...product };
    if (this.editingProduct.imageUrl && !this.editingProduct.imageUrl.trim()) {
      this.editingProduct.imageUrl = null;
    }
    this.previewUrl = null;
    this.selectedFile = null;
    this.uploading = false;
    this.uploadProgressText = '';
  }

  closeEditModal(): void {
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
    if (this.editingProduct) {
      this.toastService.success('Product image saved successfully!');
      this.closeEditModal();
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
      return `http://localhost:5000${url}`;
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
}

