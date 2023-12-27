import { Inject, OnModuleInit, Injectable } from '@nestjs/common';
import { ClientGrpc, RpcException } from '@nestjs/microservices';
import { TaskArgs } from './dto/task-args.dto';
import { NewTaskInput } from './dto/new-task-input.dto';
import {
  TASK_GR_PC_SERVICE_NAME,
  TASK_PACKAGE_NAME,
  TaskGRPCServiceClient,
  GRPCTask,
  GRPCTaskList,
  GRPCStatusList,
  TaskId,
  GRPCStatus,
} from '../../grpc/interface/task';
import { GQLTask } from './entity/task.entity';
import { catchError, lastValueFrom, map } from 'rxjs';
import { GQLStatus } from './entity/status.entity';
import { UpdateTaskInput } from './dto/update-task-input.dto';

@Injectable()
export class TaskService implements OnModuleInit {
  private taskgRPCService: TaskGRPCServiceClient;

  constructor(@Inject(TASK_PACKAGE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.taskgRPCService = this.client.getService<TaskGRPCServiceClient>(
      TASK_GR_PC_SERVICE_NAME,
    );
  }

  async findAllStatus(): Promise<GQLStatus[]> {
    // lastValueFrom function converts Observable to Promise
    return await lastValueFrom(
      this.taskgRPCService.findAllStatus({}).pipe(
        // Map each response from gRPC
        map((response: GRPCStatusList) => {
          if (response.statusList) {
            // Convert GRPCStatusList in gRPC to GQLStatus[] in BFF
            return response.statusList.map(
              (status: GRPCStatus) => new GQLStatus(status),
            );
          }
          return [];
        }),
        catchError((err) => {
          throw new RpcException(err);
        }),
      ),
    );
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

  async findOneById(id: number): Promise<GQLTask> {
    return await lastValueFrom(
      this.taskgRPCService.findOne({ id: id }).pipe(
        map((task: GRPCTask) => {
          if (task) {
            return new GQLTask(task);
          }
          return null;
        }),
        // catchError((err) => {
        //   throw new RpcException(err);
        // }),
      ),
    );
  }

  async create(newTaskData: NewTaskInput): Promise<number> {
    return await lastValueFrom(
      this.taskgRPCService.createTask(newTaskData).pipe(
        map((task: TaskId) => {
          if (task) {
            return task.id;
          }
          return null;
        }),
      ),
    );
  }

  async update(id: number, updatedTaskData: UpdateTaskInput): Promise<number> {
    console.log({ ...updatedTaskData, taskId: id });
    return await lastValueFrom(
      this.taskgRPCService.updateTask({ ...updatedTaskData, taskId: id }).pipe(
        map((task: TaskId) => {
          if (task) {
            return task.id;
          }
          return null;
        }),
      ),
    );
  }

  remove(id: number): Promise<GQLTask> {
    // TODO: Implement Remove gRPC Service
    console.log(id);
    return null;
  }
}
