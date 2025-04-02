export const isVercel = process.env.VERCEL_ENV !== undefined;
export const isProduction = process.env.VERCEL_ENV === 'production';
export const isPreview = process.env.VERCEL_ENV === 'preview';
export const isDevelopment = process.env.VERCEL_ENV === 'development' || !isVercel;
