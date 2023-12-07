import { Inject, OnModuleInit, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
// import { Observable } from 'rxjs';
import { TaskArgs } from './dto/task-args.dto';
import { NewTaskInput } from './dto/new-task-input.dto';
import {
  TASK_GR_PC_SERVICE_NAME,
  TASK_PACKAGE_NAME,
  TaskGRPCServiceClient,
  Task as TaskGRPC,
  TaskList,
} from 'src/grpc/interface/task';
import { Task } from './entity/task.entity';
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

  findOneById(id: number): Promise<Task> {
    // TODO: Convert Task interface from gRPC Service to GraphQL Task entity
    // return this.taskgRPCService.findOne({ id: id });
    console.log(id);
    return null;
  }

  findAll(taskArgs: TaskArgs): Promise<Task[]> {
    console.log(taskArgs);

    // TODO: Convert TaskList interface from gRPC Service to GraphQL Task[] entity
    return lastValueFrom(
      this.taskgRPCService
        .findMany({
          title: taskArgs.title,
          assignUserName: taskArgs.assignUserName,
        })
        .pipe(
          map((response: TaskList) =>
            response.tasks.map((task: TaskGRPC) => new Task(task)),
          ),
        ),
    );
    // return null;
  }

  create(newTaskData: NewTaskInput): Promise<Task> {
    // TODO: Implement Create gRPC Service
    console.log(newTaskData);
    return null;
  }

  remove(id: number): Promise<Task> {
    // TODO: Implement Remove gRPC Service
    console.log(id);
    return null;
  }
}
