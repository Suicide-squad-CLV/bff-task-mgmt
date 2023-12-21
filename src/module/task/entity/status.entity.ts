import { Field, ObjectType } from '@nestjs/graphql';
import { GRPCStatus } from 'src/grpc/interface/task';

@ObjectType()
export class GQLStatus {
  @Field()
  id: string;

  @Field()
  statusName: string;

  @Field()
  backgroundColor: string;

  @Field()
  textColor: string;

  @Field()
  persisted: boolean;

  constructor(status: GRPCStatus) {
    // Map GRPCStatus to GQLStatus
    this.id = status.id;
    this.statusName = status.statusName;
    this.backgroundColor = status.backgroundHexColor;
    this.textColor = status.textHexColor;
    this.persisted = status.persisted ?? false;
  }
}
