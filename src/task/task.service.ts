import { Inject, OnModuleInit, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { TaskById } from './interface/task-by-id.interface';
import { TaskList } from './interface/task-list.interface';
import { Task } from './entity/task.entity';
import { TaskArgs } from './dto/task-args.dto';
import { NewTaskInput } from './dto/new-task-input.dto';

interface TaskGRPCService {
  findOne(data: TaskById): Observable<Task>;
  findMany(data: TaskList): Observable<Task[]>;
}

@Injectable()
export class TaskService implements OnModuleInit {
  private taskgRPCService: TaskGRPCService;

  constructor(@Inject('TASK_PACKAGE') private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.taskgRPCService =
      this.client.getService<TaskGRPCService>('TaskGRPCService');
  }

  findOneById(id: number): Observable<Task> {
    return this.taskgRPCService.findOne({ id: id });
  }

  findAll(taskArgs: TaskArgs): Observable<Task[]> {
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
