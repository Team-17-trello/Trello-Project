import { Body, Controller, Delete, HttpCode, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserInfo } from '../utils/userInfo-decolator';
import { RemoveUserDto } from './dto/remove.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('유저')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(AuthGuard('jwt'))
  @Put()
  @HttpCode(HttpStatus.OK)
  @Put()
  @ApiOperation({ summary: '유저 정보 수정' })
  @ApiResponse({
    status: 200,
    description: '유저 정보가 성공적으로 수정되었습니다.',
    type: UpdateUserDto,
  })
  @UseGuards(AuthGuard('jwt'))
  update(@UserInfo() user: UserEntity, @Body() userUpdateDto: UpdateUserDto) {
    return this.userService.update(user, userUpdateDto);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '유저 정보 삭제' })
  @ApiResponse({
    status: 200,
    description: '유저 정보가 성공적으로 삭제되었습니다.',
    type: RemoveUserDto,
  })
  @UseGuards(AuthGuard('jwt'))
  remove(@UserInfo() user: UserEntity, @Body() removeUserDto: RemoveUserDto) {
    return this.userService.remove(user, removeUserDto);
  }
}
