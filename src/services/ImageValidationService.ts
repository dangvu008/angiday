export interface ImageValidationConfig {
  // Kích thước file
  maxFileSize: number; // bytes
  minFileSize: number; // bytes
  
  // Kích thước ảnh
  maxWidth: number;
  maxHeight: number;
  minWidth: number;
  minHeight: number;
  
  // Tỷ lệ khung hình
  aspectRatios: Array<{
    name: string;
    ratio: number; // width/height
    tolerance: number; // độ chênh lệch cho phép
  }>;
  
  // Định dạng file
  allowedFormats: string[];
  
  // Chất lượng
  minQuality: number; // 0-100
  maxQuality: number; // 0-100
}

export interface ImageValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  imageInfo: {
    width: number;
    height: number;
    fileSize: number;
    format: string;
    aspectRatio: number;
    quality?: number;
  };
  suggestions: string[];
  optimizationNeeded: boolean;
}

export interface ImageOptimizationOptions {
  targetWidth?: number;
  targetHeight?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  maintainAspectRatio?: boolean;
}

export class ImageValidationService {
  // Cấu hình mặc định cho các loại ảnh trong ứng dụng
  static readonly CONFIGS = {
    RECIPE_CARD: {
      maxFileSize: 5 * 1024 * 1024, // 5MB
      minFileSize: 10 * 1024, // 10KB
      maxWidth: 1920,
      maxHeight: 1080,
      minWidth: 400,
      minHeight: 300,
      aspectRatios: [
        { name: '4:3 (Khuyến nghị)', ratio: 4/3, tolerance: 0.1 },
        { name: '16:9', ratio: 16/9, tolerance: 0.1 },
        { name: '1:1 (Vuông)', ratio: 1, tolerance: 0.05 }
      ],
      allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
      minQuality: 60,
      maxQuality: 95
    },
    RECIPE_HERO: {
      maxFileSize: 8 * 1024 * 1024, // 8MB
      minFileSize: 50 * 1024, // 50KB
      maxWidth: 2560,
      maxHeight: 1440,
      minWidth: 800,
      minHeight: 600,
      aspectRatios: [
        { name: '4:3 (Khuyến nghị)', ratio: 4/3, tolerance: 0.1 },
        { name: '16:9', ratio: 16/9, tolerance: 0.1 }
      ],
      allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
      minQuality: 70,
      maxQuality: 90
    },
    AVATAR: {
      maxFileSize: 2 * 1024 * 1024, // 2MB
      minFileSize: 5 * 1024, // 5KB
      maxWidth: 512,
      maxHeight: 512,
      minWidth: 100,
      minHeight: 100,
      aspectRatios: [
        { name: '1:1 (Vuông)', ratio: 1, tolerance: 0.02 }
      ],
      allowedFormats: ['image/jpeg', 'image/png', 'image/webp'],
      minQuality: 70,
      maxQuality: 90
    }
  };

  /**
   * Validate hình ảnh từ File object
   */
  static async validateImage(
    file: File, 
    configType: keyof typeof ImageValidationService.CONFIGS = 'RECIPE_CARD'
  ): Promise<ImageValidationResult> {
    const config = this.CONFIGS[configType];
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];

    // Kiểm tra định dạng file
    if (!config.allowedFormats.includes(file.type)) {
      errors.push(`Định dạng file không được hỗ trợ. Chỉ chấp nhận: ${config.allowedFormats.map(f => f.split('/')[1]).join(', ')}`);
    }

    // Kiểm tra kích thước file
    if (file.size > config.maxFileSize) {
      errors.push(`File quá lớn. Kích thước tối đa: ${this.formatFileSize(config.maxFileSize)}`);
      suggestions.push('Nén ảnh hoặc giảm chất lượng để giảm kích thước file');
    }

    if (file.size < config.minFileSize) {
      warnings.push(`File có vẻ quá nhỏ. Kích thước tối thiểu khuyến nghị: ${this.formatFileSize(config.minFileSize)}`);
    }

    // Đọc thông tin ảnh
    const imageInfo = await this.getImageInfo(file);

    // Kiểm tra kích thước ảnh
    if (imageInfo.width > config.maxWidth || imageInfo.height > config.maxHeight) {
      errors.push(`Kích thước ảnh quá lớn. Tối đa: ${config.maxWidth}x${config.maxHeight}px`);
      suggestions.push(`Resize ảnh xuống ${config.maxWidth}x${config.maxHeight}px`);
    }

    if (imageInfo.width < config.minWidth || imageInfo.height < config.minHeight) {
      errors.push(`Kích thước ảnh quá nhỏ. Tối thiểu: ${config.minWidth}x${config.minHeight}px`);
    }

    // Kiểm tra tỷ lệ khung hình
    const aspectRatioCheck = this.checkAspectRatio(imageInfo.aspectRatio, config.aspectRatios);
    if (!aspectRatioCheck.isValid) {
      warnings.push(`Tỷ lệ khung hình không tối ưu. Khuyến nghị: ${aspectRatioCheck.recommended}`);
      suggestions.push(`Crop ảnh theo tỷ lệ ${aspectRatioCheck.recommended} để hiển thị tốt nhất`);
    }

    // Kiểm tra chất lượng (nếu có thể xác định)
    if (imageInfo.quality) {
      if (imageInfo.quality < config.minQuality) {
        warnings.push(`Chất lượng ảnh thấp (${imageInfo.quality}%). Khuyến nghị tối thiểu: ${config.minQuality}%`);
      }
      if (imageInfo.quality > config.maxQuality) {
        suggestions.push(`Có thể giảm chất lượng xuống ${config.maxQuality}% để giảm kích thước file`);
      }
    }

    // Đề xuất tối ưu hóa
    const optimizationNeeded = errors.length > 0 || 
      imageInfo.width > config.maxWidth * 0.8 || 
      imageInfo.height > config.maxHeight * 0.8 ||
      file.size > config.maxFileSize * 0.8;

    if (optimizationNeeded && errors.length === 0) {
      suggestions.push('Ảnh có thể được tối ưu hóa để tải nhanh hơn');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      imageInfo,
      suggestions,
      optimizationNeeded
    };
  }

  /**
   * Lấy thông tin chi tiết của ảnh
   */
  private static async getImageInfo(file: File): Promise<ImageValidationResult['imageInfo']> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
          fileSize: file.size,
          format: file.type,
          aspectRatio: img.naturalWidth / img.naturalHeight,
          quality: this.estimateImageQuality(file)
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Không thể đọc thông tin ảnh'));
      };

      img.src = url;
    });
  }

  /**
   * Ước tính chất lượng ảnh dựa trên kích thước file và độ phân giải
   */
  private static estimateImageQuality(file: File): number | undefined {
    if (file.type !== 'image/jpeg') return undefined;

    // Công thức ước tính đơn giản dựa trên tỷ lệ file size / pixel count
    // Chỉ mang tính chất tham khảo
    const bytesPerPixel = file.size / (1024 * 1024); // Rough estimation
    
    if (bytesPerPixel > 0.5) return 90;
    if (bytesPerPixel > 0.3) return 80;
    if (bytesPerPixel > 0.2) return 70;
    if (bytesPerPixel > 0.1) return 60;
    return 50;
  }

  /**
   * Kiểm tra tỷ lệ khung hình
   */
  private static checkAspectRatio(
    actualRatio: number, 
    allowedRatios: ImageValidationConfig['aspectRatios']
  ): { isValid: boolean; recommended: string } {
    for (const allowed of allowedRatios) {
      const diff = Math.abs(actualRatio - allowed.ratio);
      if (diff <= allowed.tolerance) {
        return { isValid: true, recommended: allowed.name };
      }
    }

    // Tìm tỷ lệ gần nhất
    const closest = allowedRatios.reduce((prev, curr) => {
      const prevDiff = Math.abs(actualRatio - prev.ratio);
      const currDiff = Math.abs(actualRatio - curr.ratio);
      return currDiff < prevDiff ? curr : prev;
    });

    return { isValid: false, recommended: closest.name };
  }

  /**
   * Tối ưu hóa ảnh
   */
  static async optimizeImage(
    file: File, 
    options: ImageOptimizationOptions = {}
  ): Promise<{ file: File; originalSize: number; newSize: number; compressionRatio: number }> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        const { width: originalWidth, height: originalHeight } = img;
        
        // Tính toán kích thước mới
        let { targetWidth, targetHeight } = options;
        
        if (options.maintainAspectRatio !== false) {
          const aspectRatio = originalWidth / originalHeight;
          
          if (targetWidth && !targetHeight) {
            targetHeight = targetWidth / aspectRatio;
          } else if (targetHeight && !targetWidth) {
            targetWidth = targetHeight * aspectRatio;
          } else if (!targetWidth && !targetHeight) {
            targetWidth = originalWidth;
            targetHeight = originalHeight;
          }
        }

        canvas.width = targetWidth || originalWidth;
        canvas.height = targetHeight || originalHeight;

        // Vẽ ảnh lên canvas với kích thước mới
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Chuyển đổi thành blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Không thể tối ưu hóa ảnh'));
              return;
            }

            const optimizedFile = new File(
              [blob], 
              file.name.replace(/\.[^/.]+$/, `.${options.format || 'jpeg'}`),
              { type: `image/${options.format || 'jpeg'}` }
            );

            resolve({
              file: optimizedFile,
              originalSize: file.size,
              newSize: blob.size,
              compressionRatio: (1 - blob.size / file.size) * 100
            });
          },
          `image/${options.format || 'jpeg'}`,
          (options.quality || 80) / 100
        );
      };

      img.onerror = () => reject(new Error('Không thể đọc ảnh'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Format kích thước file thành chuỗi dễ đọc
   */
  private static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Tạo thumbnail từ ảnh
   */
  static async createThumbnail(
    file: File, 
    size: number = 150
  ): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        const { width, height } = img;
        const aspectRatio = width / height;
        
        let newWidth, newHeight;
        if (aspectRatio > 1) {
          newWidth = size;
          newHeight = size / aspectRatio;
        } else {
          newWidth = size * aspectRatio;
          newHeight = size;
        }

        canvas.width = size;
        canvas.height = size;

        // Vẽ background trắng
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, size, size);

        // Vẽ ảnh ở giữa
        const x = (size - newWidth) / 2;
        const y = (size - newHeight) / 2;
        ctx.drawImage(img, x, y, newWidth, newHeight);

        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };

      img.onerror = () => reject(new Error('Không thể tạo thumbnail'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Kiểm tra xem ảnh có phù hợp với responsive design không
   */
  static checkResponsiveCompatibility(imageInfo: ImageValidationResult['imageInfo']): {
    isResponsive: boolean;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    let isResponsive = true;

    // Kiểm tra kích thước cho mobile
    if (imageInfo.width < 320) {
      isResponsive = false;
      recommendations.push('Ảnh quá nhỏ cho màn hình mobile (tối thiểu 320px)');
    }

    // Kiểm tra kích thước cho desktop
    if (imageInfo.width > 1920) {
      recommendations.push('Ảnh có thể quá lớn cho web, cân nhắc resize xuống 1920px');
    }

    // Kiểm tra tỷ lệ khung hình cho responsive
    const aspectRatio = imageInfo.aspectRatio;
    if (aspectRatio < 0.5 || aspectRatio > 3) {
      recommendations.push('Tỷ lệ khung hình có thể gây khó khăn trong responsive design');
    }

    return { isResponsive, recommendations };
  }
}
