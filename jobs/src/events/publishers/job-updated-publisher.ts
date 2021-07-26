import {Publisher, Subjects, JobUpdatedEvent} from '@yolanmq/common'
export class JobUpdatedPublisher extends Publisher<JobUpdatedEvent> {
    subject: Subjects.JobUpdated = Subjects.JobUpdated
}

