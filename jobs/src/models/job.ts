import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface JobAttrs {
    title: string;
    price: number;
    userId: string;
}

interface JobDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
}

interface JobModel extends mongoose.Model<JobDoc> {
    build(attrs: JobAttrs): JobDoc;
}

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        orderId: {
            type: String,
        }
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);
jobSchema.set('versionKey', 'version');
jobSchema.plugin(updateIfCurrentPlugin);

jobSchema.statics.build = (attrs: JobAttrs) => {
    return new Job(attrs);
};

const Job = mongoose.model<JobDoc, JobModel>('Job', jobSchema);

export { Job };
