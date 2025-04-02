export const isVercel = process.env.NEXT_PUBLIC_VERCEL_ENV !== undefined;
export const isProduction = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';
export const isPreview = process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview';
export const isDevelopment = process.env.NEXT_PUBLIC_VERCEL_ENV === 'development' || !isVercel;
