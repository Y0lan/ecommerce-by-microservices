import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { Order, OrderStatus } from './order';

interface JobAttributes {
    id: string;
    title: string;
    price: number;
}

console.log("ddd")
export interface JobDoc extends mongoose.Document {
    title: string;
    price: number;
    version: number;
    isReserved(): Promise<boolean>;
}

interface JobModel extends mongoose.Model<JobDoc> {
    build(attrs: JobAttributes): JobDoc;
    findByEvent(event: {
        id: string;
        version: number;
    }): Promise<JobDoc | null>;
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
            min: 0,
        },
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

jobSchema.statics.findByEvent = (event: { id: string; version: number }) => {
    return Job.findOne({
        _id: event.id,
        version: event.version - 1,
    });
};
jobSchema.statics.build = (attributes: JobAttributes) => {
    return new Job({
        _id: attributes.id,
        title: attributes.title,
        price: attributes.price,
    });
};
jobSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        // @ts-ignore
        job: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Completed,
            ],
        },
    });

    return !!existingOrder;
};

const Job = mongoose.model<JobDoc, JobModel>('Job', jobSchema);

export { Job };
