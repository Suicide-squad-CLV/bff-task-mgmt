import { Field, ObjectType } from '@nestjs/graphql';
import { GRPCStatus } from 'src/grpc/interface/task';

@ObjectType()
export class GQLStatus {
  @Field()
  id: string;

  @Field()
  statusName: string;

  constructor(status: GRPCStatus) {
    // Map GRPCStatus to GQLStatus
    this.id = status.id;
    this.statusName = status.statusName;
  }
}
