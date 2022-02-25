import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Enables authentication using username and password in and endpoint.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
