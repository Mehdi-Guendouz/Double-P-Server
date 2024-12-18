import { Body, Controller, Delete, Get, Post, Req } from '@nestjs/common';
import { FunctionalitiesService } from './functionalities.service';
import { NumberParfaitDto, PalindromeDto } from './dto/check.palindrome.dto';

@Controller('carte')
export class FunctionalitiesController {
  constructor(
    private readonly FunctionalitiesService: FunctionalitiesService,
  ) {}

  @Get('')
  async getAllHistoryForUser(@Req() req) {
    return await this.FunctionalitiesService.getAllHistory(req.user);
  }

  @Post('palindrome')
  async isPalindrome(@Req() req, @Body() createPalindrome: PalindromeDto) {
    return await this.FunctionalitiesService.isPalindrome(
      req.user,
      createPalindrome,
    );
  }

  @Post('parfait')
  async isParfait(@Req() req, @Body() createParfait: NumberParfaitDto) {
    return await this.FunctionalitiesService.isPerfectNumber(
      req.user,
      createParfait,
    );
  }

  @Post('nearestPerfect')
  async nearestPerfect(@Req() req, @Body() createNearest: NumberParfaitDto) {
    return await this.FunctionalitiesService.nearestPerfectNumber(
      req.user,
      createNearest,
    );
  }

  @Delete('delete/:id')
  async deleteHistory(@Req() req) {
    return await this.FunctionalitiesService.deleteHistory(
      req.user,
      req.params.id,
    );
  }
}
