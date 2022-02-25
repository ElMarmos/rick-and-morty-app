import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Enables the use of the @Public() decorator to make
 * endpoints ignore the JWT authentication.
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
