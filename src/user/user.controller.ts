import { Body, Controller, Delete, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { RemoveUserDto } from './dto/remove.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from './entities/user.entity';
import { UserInfo } from '../utils/userInfo-decolator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put()
  @ApiOperation({ summary: '유저 정보 수정' })
  @UseGuards(AuthGuard('jwt'))
  update(@UserInfo() user: UserEntity, @Body() userUpdateDto: UpdateUserDto) {
    return this.userService.update(user, userUpdateDto);
  }
  @Delete()
  @ApiOperation({ summary: '유저 정보 삭제' })
  @UseGuards(AuthGuard('jwt'))
  remove(@UserInfo() user: UserEntity, @Body() removeUserDto: RemoveUserDto) {
    return this.userService.remove(user, removeUserDto);
  }
}
