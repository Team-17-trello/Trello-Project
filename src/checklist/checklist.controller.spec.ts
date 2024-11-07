import { Test, TestingModule } from '@nestjs/testing';
import { ChecklistController } from './checklist.controller';
import { ChecklistService } from './checklist.service';

describe('ChecklistController', () => {
  let controller: ChecklistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChecklistController],
      providers: [ChecklistService],
    }).compile();

    controller = module.get<ChecklistController>(ChecklistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});


// (예시)
// describe('HeroController', () => {
//   let controller: HeroController; // 컨트롤러 변수 선언
//   let service: HeroService; // 서비스 변수 선언

//   // 각 테스트 실행 전에 모듈과 종속성 설정
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [HeroController], // 테스트할 컨트롤러 설정
//       providers: [
//         {
//           provide: HeroService,
//           useValue: {
//             findHeroById: jest.fn().mockReturnValue({ id: 1, name: 'Batman' }), // 서비스 메서드 모의(Mock) 처리
//           },
//         },
//       ],
//     }).compile();

//     controller = module.get<HeroController>(HeroController); // 컨트롤러 인스턴스 가져오기
//     service = module.get<HeroService>(HeroService); // 서비스 인스턴스 가져오기
//   });

//   // 컨트롤러가 정의되었는지 테스트
//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });

//   // 컨트롤러의 getHero 메서드가 올바른 데이터를 반환하는지 테스트
//   it('should return hero by id', async () => {
//     // getHero 메서드 호출 후 반환값 검증
//     expect(await controller.getHero(1)).toEqual({ id: 1, name: 'Batman' });
//   });
// });
