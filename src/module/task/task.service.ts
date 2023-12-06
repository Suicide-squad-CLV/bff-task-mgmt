import { Inject, OnModuleInit, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { TaskArgs } from './dto/task-args.dto';
import { NewTaskInput } from './dto/new-task-input.dto';
import {
  TASK_GR_PC_SERVICE_NAME,
  TASK_PACKAGE_NAME,
  TaskGRPCServiceClient,
  Task,
} from 'src/grpc/interface/task';

@Injectable()
export class TaskService implements OnModuleInit {
  private taskgRPCService: TaskGRPCServiceClient;

  constructor(@Inject(TASK_PACKAGE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.taskgRPCService = this.client.getService<TaskGRPCServiceClient>(
      TASK_GR_PC_SERVICE_NAME,
    );
  }

  findOneById(id: number): Observable<Task> {
    return this.taskgRPCService.findOne({ id: id });
  }

  findAll(taskArgs: TaskArgs): Observable<Task> {
    return this.taskgRPCService.findMany({
      title: taskArgs.title,
      assignUserId: taskArgs.assignUserId,
    });
  }

  create(newTaskData: NewTaskInput): Observable<Task> {
    // TODO: Implement Create gRPC Service
    console.log(newTaskData);
    return null;
  }

  remove(id: number): Observable<Task> {
    // TODO: Implement Remove gRPC Service
    console.log(id);
    return null;
  }
}
