import mongoose from "mongoose";
import {Order, OrderStatus} from "./order";

interface TicketAttributes {
    title: string;
    price: number;
}

export interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    isReserved(): Promise<boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attributes: TicketAttributes): TicketDoc;
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id
        }
    }
})

ticketSchema.statics.build = (attributes: TicketAttributes) => {
    return new Ticket(attributes)
}

ticketSchema.methods.isReserved = async function (){
    const existingOrder = await Order.findOne({
        ticket: this.id,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Completed
            ]
        },
    })
    return !!existingOrder
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema)
export {Ticket}
