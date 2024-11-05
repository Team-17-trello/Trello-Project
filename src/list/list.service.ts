import { Injectable } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListEntity } from './entities/list.entity';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(ListEntity)
    private readonly listRepository: Repository<ListEntity>,
  ) {}

  async create(createListDto: CreateListDto): Promise<ListEntity> {
    // 해당 보드 내의 리스트 개수를 세어 order 값 설정
    const listCount = await this.listRepository.count({
      where: { board: { id: createListDto.boardId } },
    });

    // 새로운 리스트 생성 및 order 자동 설정
    const list = this.listRepository.create({
      ...createListDto,
      order: listCount + 1, // order 값을 보드 내 리스트 개수 + 1로 설정
    });

    // 리스트 저장
    return this.listRepository.save(list);
  }

  findAll() {
    return `This action returns all list`;
  }

  findOne(id: number) {
    return `This action returns a #${id} list`;
  }

  update(id: number, updateListDto: UpdateListDto) {
    return `This action updates a #${id} list`;
  }

  remove(id: number) {
    return `This action removes a #${id} list`;
  }
}
