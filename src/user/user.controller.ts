import { Body, Controller, Delete, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveUserDto } from './dto/remove.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { UserInfo } from '../utils/userInfo-decolator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }
  @UseGuards(AuthGuard('jwt'))
  @Put()
  update(@UserInfo() user: User, @Body() userUpdateDto : UpdateUserDto){
    return this.userService.update(user, userUpdateDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  remove(@UserInfo() user: User, @Body() removeUserDto: RemoveUserDto ){
    return this.userService.remove(user, removeUserDto);
  }
}
