import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { MediaService } from './services/media/media.service';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class AppController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('/file/upload')
  async fileUpload(@Body('fileName') fileName: string) {
    return await this.mediaService.getSignedUrl(
      window.decodeURIComponent(fileName),
    );
  }
}
