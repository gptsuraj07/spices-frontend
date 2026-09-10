// ============================================================
// ARIDHU — Media / Image Service
// Architecture stub for future Cloudflare R2 integration
// ============================================================

import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { MediaUploadRequest, MediaUploadResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class MediaService {
  /**
   * Upload an image to Cloudflare R2.
   * Currently a stub — returns an error indicating R2 is not connected.
   *
   * When connecting R2:
   * 1. Backend generates a presigned URL: POST /api/media/presigned-url
   * 2. Frontend uploads directly to R2 via the presigned URL
   * 3. Returns the public R2 URL
   */
  upload(request: MediaUploadRequest): Observable<MediaUploadResponse> {
    // TODO: Implement R2 upload via backend presigned URL
    console.warn('MediaService: R2 upload not yet implemented');
    return throwError(() => new Error('Image upload will connect to Cloudflare R2. Integration coming soon.'));
  }

  /**
   * Delete an image from R2.
   * Backend: DELETE /api/media/:key
   */
  delete(key: string): Observable<boolean> {
    console.warn('MediaService: R2 delete not yet implemented');
    return throwError(() => new Error('R2 integration coming soon.'));
  }

  /**
   * Get a thumbnail URL from a full R2 URL.
   * When using R2 with Cloudflare Image Resizing:
   */
  getThumbnailUrl(url: string, width: number): string {
    // When using Cloudflare Image Resizing:
    // return `https://your-domain.com/cdn-cgi/image/width=${width},quality=80/${url}`;
    return url;
  }

  /**
   * Create a local object URL for preview before upload.
   */
  createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * Revoke a preview URL after use.
   */
  revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}
