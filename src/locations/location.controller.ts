import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { LocationService } from './location.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  /**
   * Get a random location for the game.
   * @returns A random location.
   */
  @ApiOperation({ summary: 'Get a random location for the game' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved a random location',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/random')
  async getRandomLocation() {
    return this.locationService.getRandomLocation();
  }

  /**
   * Submit an answer for a location.
   * @param locationId - The ID of the location.
   * @param userAnswer - The user’s answer.
   * @returns Result of the answer submission.
   */
  @ApiOperation({ summary: 'Submit an answer for a location' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        locationId: { type: 'number', example: 1 },
        userAnswer: { type: 'string', example: 'Paris' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Answer submitted successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard) // Ensures only authenticated users can submit answers
  @Post('/submit')
  async submitAnswer(
    @Req() req, // Extract user from JWT token
    @Body('locationId') locationId: number,
    @Body('userAnswer') userAnswer: string,
  ) {
    const userId = req.user.userId;
    return this.locationService.submitAnswer(userId, locationId, userAnswer);
  }

  /**
   * Get the invite score for a user.
   * @param userId (Optional) - The guest user's ID if `isGuestUser` is `true`.
   * @param isGuestUser - Boolean flag indicating if the user is a guest.
   * @returns The score details for the user.
   */
  @ApiOperation({ summary: 'Get the invite score for a user' })
  @ApiQuery({
    name: 'userId',
    required: false,
    description: 'Guest user ID (if isGuestUser is true)',
    example: '12345',
  })
  @ApiQuery({
    name: 'isGuestUser',
    required: false,
    description: 'Is the user a guest?',
    example: 'true',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved invite score',
  })
  @ApiBearerAuth()
  @Get('/invite-score')
  @UseGuards(JwtAuthGuard)
  async getInviteScore(@Req() req) {
    console.log('req.user', req);
    const userId = req.user.userId;
    return this.locationService.getScore(userId);
  }

  /**
   * Reset the user’s score.
   * @returns Confirmation of score reset.
   */
  @ApiOperation({ summary: 'Reset user score' })
  @ApiResponse({ status: 200, description: 'Score reset successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('reset-score')
  async resetScore(@Req() req) {
    const userId = req.user.userId;
    console.log('userId', userId);
    return await this.locationService.resetUserScore(userId);
  }
}
