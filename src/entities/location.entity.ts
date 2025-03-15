import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  country: string;

  @Column({ type: 'text', nullable: true })
  city: string;

  @Column({ type: 'simple-array', nullable: true })
  funFacts: string[]; // Supports multiple fun facts

  @Column({ type: 'simple-array', nullable: true })
  aiGeneratedHints: string[]; // Supports multiple hints
}
