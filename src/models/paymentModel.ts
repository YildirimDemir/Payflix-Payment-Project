import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPayment extends Document {
  _id: string;
  senderAccount: mongoose.Types.ObjectId;
  receiverAccount: mongoose.Types.ObjectId;
  amount: number;
  date: Date;
  description: string;
}

const paymentSchema: Schema<IPayment> = new Schema(
  {
    senderAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    receiverAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: {
      type: String,
      default: "Payment",
    },
  },
  { timestamps: true }
);

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", paymentSchema);

export default Payment;