import { Body, Controller, Delete, HttpCode, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveUserDto } from './dto/remove.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from './entities/user.entity';
import { UserInfo } from '../utils/userInfo-decolator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @UseGuards(AuthGuard('jwt'))
  @Put()
  @HttpCode(HttpStatus.OK)
  update(@UserInfo() user: UserEntity, @Body() userUpdateDto: UpdateUserDto) {
    return this.userService.update(user, userUpdateDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  @HttpCode(HttpStatus.OK)
  remove(@UserInfo() user: UserEntity, @Body() removeUserDto: RemoveUserDto) {
    return this.userService.remove(user, removeUserDto);
  }
}
