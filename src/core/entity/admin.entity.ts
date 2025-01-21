import { BaseEntity } from 'src/common/database/BaseEntity';
import { RoleAdmin } from 'src/common/enum';
import { Column, Entity } from 'typeorm';

@Entity('admins')
export class AdminEntity extends BaseEntity {
  @Column({ type: 'varchar', name: 'fullname' })
  @Column({ type: 'varchar', name: 'email', nullable: true, unique: true })
  email: string;
  @Column({ type: 'varchar', name: 'username', unique: true })
  username: string;
  @Column({ type: 'varchar', name: 'hashed_password' })
  hashed_password: string;
  @Column({ type: 'smallint', name: 'pass_code' })
  pass_code: number;
  @Column({
    type: 'varchar',
    name: 'phone_number',
    unique: true,
  })
  phone_number: string;
  @Column({ type: 'enum', enum: RoleAdmin, default: RoleAdmin.ADMIN })
  role: string;
  @Column({ type: 'text', name: 'refresh_token' })
  refresh_token: string;
}
