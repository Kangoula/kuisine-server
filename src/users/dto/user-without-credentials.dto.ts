import { User, CredentialsColumn } from '../entities/user.entity';
import { OmitType } from '@nestjs/swagger';

export class UserWithoutCredentials extends OmitType(User, CredentialsColumn) {}
