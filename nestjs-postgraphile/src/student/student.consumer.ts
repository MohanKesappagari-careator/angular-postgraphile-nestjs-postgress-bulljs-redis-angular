import {
  OnGlobalQueueFailed,
  OnQueueCompleted,
  OnQueueFailed,
  Process,
  Processor,
} from "@nestjs/bull";
import { InjectRepository } from "@nestjs/typeorm";
import { Job } from "bull";
import { StudentD } from "src/Student";
import { Repository } from "typeorm";
import { Student } from "./entities/student.entity";
import * as SC from "socketcluster-client";
import { HttpException, Logger } from "@nestjs/common";

let socket = SC.create({
  hostname: "localhost",
  port: 8002,
});
@Processor("student")
export class StudentConsumer {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}
  @Process("create")
  async createStudent(job: Job<[StudentD]>) {
    const data = this.studentRepository.save(job.data);
    return data.catch(() => {
      throw new HttpException({ message: "User already exists" }, 400);
    });
  }
  @OnQueueCompleted()
  completed(job: Job, result: any) {
    (async () => {
      try {
        await socket.invokePublish(
          "student",
          `Completed job with result ${result}`,
        );
      } catch (error) {
        Logger.log(error);
      }
    })();
    Logger.log(`Completed job with result ${result}`);
  }

  @OnQueueFailed()
  failed(job: Job, err: Error) {
    (async () => {
      try {
        await socket.invokePublish("studentF", `Failed job with error ${err}`);
      } catch (error) {
        Logger.log(error);
      }
    })();
    Logger.log(`Failed job with error ${err}...`);
  }
}
