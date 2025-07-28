import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ImageIcon, AlertTriangle } from 'lucide-react';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: 'square' | '4/3' | '16/9' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
}

interface ImageState {
  isLoading: boolean;
  hasError: boolean;
  currentSrc: string;
}

const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className,
  aspectRatio = 'auto',
  objectFit = 'cover',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  placeholder = 'empty',
  fallbackSrc = '/placeholder-image.jpg',
  onLoad,
  onError,
  loading = 'lazy'
}) => {
  const [imageState, setImageState] = useState<ImageState>({
    isLoading: true,
    hasError: false,
    currentSrc: src
  });

  useEffect(() => {
    setImageState({
      isLoading: true,
      hasError: false,
      currentSrc: src
    });
  }, [src]);

  const handleLoad = () => {
    setImageState(prev => ({
      ...prev,
      isLoading: false,
      hasError: false
    }));
    onLoad?.();
  };

  const handleError = () => {
    setImageState(prev => ({
      ...prev,
      isLoading: false,
      hasError: true,
      currentSrc: fallbackSrc
    }));
    onError?.();
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case 'square':
        return 'aspect-square';
      case '4/3':
        return 'aspect-[4/3]';
      case '16/9':
        return 'aspect-video';
      default:
        return '';
    }
  };

  const getObjectFitClass = () => {
    switch (objectFit) {
      case 'cover':
        return 'object-cover';
      case 'contain':
        return 'object-contain';
      case 'fill':
        return 'object-fill';
      case 'scale-down':
        return 'object-scale-down';
      default:
        return 'object-cover';
    }
  };

  const containerClasses = cn(
    'relative overflow-hidden',
    getAspectRatioClass(),
    className
  );

  const imageClasses = cn(
    'w-full h-full transition-opacity duration-300',
    getObjectFitClass(),
    {
      'opacity-0': imageState.isLoading,
      'opacity-100': !imageState.isLoading
    }
  );

  return (
    <div className={containerClasses}>
      {/* Loading Placeholder */}
      {imageState.isLoading && placeholder !== 'empty' && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-gray-400" />
        </div>
      )}

      {/* Error State */}
      {imageState.hasError && (
        <div className="absolute inset-0 bg-gray-100 flex flex-col items-center justify-center text-gray-500">
          <AlertTriangle className="h-8 w-8 mb-2" />
          <span className="text-sm">Không thể tải ảnh</span>
        </div>
      )}

      {/* Main Image */}
      <img
        src={imageState.currentSrc}
        alt={alt}
        className={imageClasses}
        sizes={sizes}
        loading={priority ? 'eager' : loading}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
      />

      {/* Overlay for additional content */}
      <div className="absolute inset-0 pointer-events-none">
        {/* This can be used for overlays, badges, etc. */}
      </div>
    </div>
  );
};

// Preset components for common use cases
export const RecipeCardImage: React.FC<Omit<ResponsiveImageProps, 'aspectRatio' | 'objectFit'>> = (props) => (
  <ResponsiveImage
    {...props}
    aspectRatio="4/3"
    objectFit="cover"
    className={cn('rounded-lg', props.className)}
  />
);

export const RecipeHeroImage: React.FC<Omit<ResponsiveImageProps, 'aspectRatio' | 'objectFit'>> = (props) => (
  <ResponsiveImage
    {...props}
    aspectRatio="16/9"
    objectFit="cover"
    priority={true}
    className={cn('rounded-2xl shadow-2xl', props.className)}
  />
);

export const AvatarImage: React.FC<Omit<ResponsiveImageProps, 'aspectRatio' | 'objectFit'>> = (props) => (
  <ResponsiveImage
    {...props}
    aspectRatio="square"
    objectFit="cover"
    className={cn('rounded-full', props.className)}
  />
);

// Hook for image optimization suggestions
export const useImageOptimization = (src: string) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.onload = () => {
      const suggestions: string[] = [];
      
      // Check if image is too large
      if (img.naturalWidth > 1920) {
        suggestions.push('Ảnh có độ phân giải cao, cân nhắc resize để tải nhanh hơn');
      }
      
      // Check aspect ratio
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      if (aspectRatio < 0.5 || aspectRatio > 3) {
        suggestions.push('Tỷ lệ khung hình có thể không phù hợp với responsive design');
      }
      
      setSuggestions(suggestions);
    };
    
    img.src = src;
  }, [src]);

  return suggestions;
};

// Utility function to generate srcSet for responsive images
export const generateSrcSet = (baseSrc: string, sizes: number[] = [320, 640, 960, 1280, 1920]) => {
  if (!baseSrc || baseSrc.startsWith('data:')) return '';
  
  return sizes
    .map(size => `${baseSrc}?w=${size} ${size}w`)
    .join(', ');
};

// Component for image with multiple sizes
export const OptimizedImage: React.FC<ResponsiveImageProps & { 
  srcSizes?: number[];
  webpSrc?: string;
}> = ({ 
  src, 
  srcSizes = [320, 640, 960, 1280, 1920],
  webpSrc,
  ...props 
}) => {
  const srcSet = generateSrcSet(src, srcSizes);
  const webpSrcSet = webpSrc ? generateSrcSet(webpSrc, srcSizes) : '';

  return (
    <picture>
      {/* WebP version for modern browsers */}
      {webpSrcSet && (
        <source
          srcSet={webpSrcSet}
          sizes={props.sizes}
          type="image/webp"
        />
      )}
      
      {/* Fallback */}
      <ResponsiveImage
        {...props}
        src={src}
        // Add srcSet if available
        {...(srcSet && { 
          // Note: We'd need to modify ResponsiveImage to accept srcSet
          // For now, just use the base src
        })}
      />
    </picture>
  );
};

export default ResponsiveImage;
