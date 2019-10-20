import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
@Entity('students', { schema: 'school' })
export class Students {
  @Column('int', {
    primary: true,
    name: 'id',
  })
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', {
    nullable: false,
    unique: true,
    length: 200,

    name: 'email',
  })
  public email: string;

  @Column('boolean', {
    nullable: false,
    default: false,
    name: 'is_suspended',
  })
  public suspended: boolean;

  @Column('boolean', {
    nullable: false,
    default: true,
    name: 'status',
  })
  public status: boolean;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  public createdAt: Date;

  @CreateDateColumn({ name: 'updated_at', type: 'timestamp' })
  public updatedAt: Date;
}
