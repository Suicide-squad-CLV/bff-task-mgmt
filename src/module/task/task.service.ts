import { Inject, OnModuleInit, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { TaskArgs } from './dto/task-args.dto';
import { NewTaskInput } from './dto/new-task-input.dto';
import {
  TASK_GR_PC_SERVICE_NAME,
  TASK_PACKAGE_NAME,
  TaskGRPCServiceClient,
  GRPCTask,
  GRPCTaskList,
} from 'src/grpc/interface/task';
import { GQLTask } from './entity/task.entity';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class TaskService implements OnModuleInit {
  private taskgRPCService: TaskGRPCServiceClient;

  constructor(@Inject(TASK_PACKAGE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.taskgRPCService = this.client.getService<TaskGRPCServiceClient>(
      TASK_GR_PC_SERVICE_NAME,
    );
  }

  findOneById(id: number): Promise<GQLTask> {
    // TODO: Convert Task interface from gRPC Service to GraphQL Task entity
    // return this.taskgRPCService.findOne({ id: id });
    console.log(id);
    return null;
  }

  async findAll(taskArgs: TaskArgs): Promise<GQLTask[]> {
    // lastValueFrom function converts Observable to Promise
    return await lastValueFrom(
      this.taskgRPCService
        .findMany({
          // gRPC parameter for FindMany Service
          title: taskArgs.title,
          userId: taskArgs.userId,
          statusId: taskArgs.statusId,
        })
        .pipe(
          // Map each response from gRPC
          map((response: GRPCTaskList) => {
            if (response.tasks) {
              // Convert GRPCTaskList in gRPC to GQLTask[] in BFF
              return response.tasks.map((task: GRPCTask) => new GQLTask(task));
            }
            return [];
          }),
        ),
    );
  }

  create(newTaskData: NewTaskInput): Promise<GQLTask> {
    // TODO: Implement Create gRPC Service
    console.log(newTaskData);
    return null;
  }

  remove(id: number): Promise<GQLTask> {
    // TODO: Implement Remove gRPC Service
    console.log(id);
    return null;
  }
}
