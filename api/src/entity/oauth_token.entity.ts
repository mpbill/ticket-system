import { OrganizationService } from "src/organization/organization.service";
import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { Organization } from "./organization.entity";

@Entity('oauth_tokens')
export class OAuthToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 1000 })
  accessToken: string;

  @Column({ type: 'varchar', length: 1000 })
  grantId: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'int' })
  expiresIn: number;

  @Column({ type: 'varchar', length: 1000 })
  idToken?: string;

  @Column({ type: 'varchar', length: 50 })
  provider?: string;

  @Column({ type: 'varchar', length: 50 })
  tokenType?: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  processedFolderId?: string;

  @OneToOne(() => Organization, organization => organization.oauthToken, { cascade: true })
  @JoinColumn()
  organization: Organization;

}
