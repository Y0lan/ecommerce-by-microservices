import {Publisher, Subjects, JobCreatedEvent} from '@yolanmq/common'
export class JobCreatedPublisher extends Publisher<JobCreatedEvent> {
    subject: Subjects.JobCreated = Subjects.JobCreated
}

