import { Controller } from '@nestjs/common';
import { ItemService } from './item.service';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}
}
