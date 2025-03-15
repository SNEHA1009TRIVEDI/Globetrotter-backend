import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from 'src/entities/location.entity';
import { Users } from 'src/entities/user.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(Users) private readonly userRepository: Repository<Users>,
  ) {}

  async getRandomLocation() {
    const locations = await this.locationRepository.find();
    if (!locations.length) return null;

    const randomLocation =
      locations[Math.floor(Math.random() * locations.length)];
    const hints = randomLocation.aiGeneratedHints
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    const allCountries = locations.map((loc) => loc.country);
    const incorrectOptions = allCountries
      .filter((country) => country !== randomLocation.country)
      .sort(() => 0.5 - Math.random())
      .slice(1);

    return {
      id: randomLocation.id,
      hints,
      options: [...incorrectOptions, randomLocation.country].sort(
        () => 0.5 - Math.random(),
      ),
      correctAnswer: randomLocation.country,
      funFacts: randomLocation.funFacts,
    };
  }

  async submitAnswer(userId: number, locationId: number, userAnswer: string) {
    const location = await this.locationRepository.findOne({
      where: { id: locationId },
    });
    if (!location) throw new NotFoundException('Invalid location');

    const isCorrect =
      userAnswer.toLowerCase() === location.country.toLowerCase();

    if (isCorrect) {
      await this.userRepository.increment({ id: userId }, 'correctAttempts', 1);
    } else {
      await this.userRepository.increment(
        { id: userId },
        'incorrectAttempts',
        1,
      );
    }
    await this.userRepository.increment({ id: userId }, 'totalAttempts', 1);
    return {
      success: isCorrect,
      message: isCorrect
        ? '🎉 Correct! Well done! Confetti animation triggered!'
        : '😢 Incorrect! Try again! Sad-face animation triggered!',
      funFacts: location.funFacts,
    };
  }

  async getScore(userId: number) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    return {
      user: user?.username,
      isGuestUser: user?.isGuestUser,
      correctAttempts: user?.correctAttempts ?? 0,
      incorrectAttempts: user?.incorrectAttempts ?? 0,
      totalAttempts: user?.totalAttempts ?? 0,
    };
  }

  async resetUserScore(
    userId: number,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return { success: false, message: 'User not found' };
    }
    console.log('user', user);
    user.correctAttempts = 0;
    user.incorrectAttempts = 0;
    user.totalAttempts = 0;
    await this.userRepository.save(user);

    return { success: true, message: 'Score has been reset successfully' };
  }
}
