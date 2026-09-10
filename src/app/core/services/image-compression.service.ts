import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ImageCompressionService {
  /**
   * Compresses an image file before uploading.
   * - Validates image file type.
   * - Resizes to maximum dimension (default 1600px).
   * - Converts output to WebP format (quality ~0.82).
   */
  async compressImage(file: File, maxDimension = 1600, quality = 0.82): Promise<File> {
    if (!file.type.startsWith('image/')) {
      throw new Error('Unsupported file type. Please select a valid image file (JPEG, PNG, WebP, etc.).');
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width >= height) {
            height = Math.round((maxDimension / width) * height);
            width = maxDimension;
          } else {
            width = Math.round((maxDimension / height) * width);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to create canvas 2D rendering context.'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Export as WebP
        canvas.toBlob(
          blob => {
            if (!blob) {
              reject(new Error('Image compression failed.'));
              return;
            }
            const cleanName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
            const compressedFile = new File([blob], cleanName, {
              type: 'image/webp',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Could not read or parse the selected image file.'));
      };

      img.src = objectUrl;
    });
  }

  /**
   * Generates a fast base64/dataURL preview string for immediate UI feedback.
   */
  generatePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve(e.target?.result as string);
      reader.onerror = err => reject(err);
      reader.readAsDataURL(file);
    });
  }
}
