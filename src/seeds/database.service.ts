import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Location } from '../entities/location.entity';
import * as fs from 'fs';
import { generateDataset } from './generateDataset';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async onModuleInit() {
    console.log('🔄 Running database seed...');
    await this.seedDatabase();
  }
  async seedDatabase() {
    const count = await this.locationRepository.count();
    if (count > 0) {
      console.log('✅ Database already seeded. Skipping...');
      return;
    }

    if (!fs.existsSync('dataset.json')) {
      console.log('⚡ dataset.json not found. Generating dataset...');
      await generateDataset(); // Auto-generate dataset
    }

    if (fs.existsSync('dataset.json')) {
      console.log('inside 12345');
      const locations = JSON.parse(fs.readFileSync('dataset.json', 'utf-8'));
      console.log(
        'locationsq',
        Array.isArray(locations),
        typeof locations,
        locations,
      );
      const locationRowArray = locations.map((locationObj) => {
        const locationRow = new Location();
        Object.assign(locationRow, {
          city: locationObj.city,
          country: locationObj.country,
          funFacts: locationObj.funFact,
          aiGeneratedHints: locationObj.aiGeneratedHints,
        });
        console.log('locationRow', locationRow);
        return locationRow;
      });
      await this.locationRepository.save(locationRowArray);
      console.log('✅ Database seeded with AI-generated travel locations!');
    } else {
      console.log('❌ Failed to generate dataset.');
    }
  }
}
