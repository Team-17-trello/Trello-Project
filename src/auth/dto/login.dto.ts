import { PartialType } from '@nestjs/mapped-types';
import { SignupDto } from './signup.dto';

export class LoginDto extends PartialType(SignupDto) {}
