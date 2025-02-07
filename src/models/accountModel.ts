import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAccount extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  accountNumber: string;
  amount: number;
  payments: mongoose.Types.ObjectId[];
}

const accountSchema: Schema<IAccount> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    accountNumber: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment", 
      },
    ],
  },
  { timestamps: true }
);

const Account: Model<IAccount> =
  mongoose.models.Account || mongoose.model<IAccount>("Account", accountSchema);

export default Account;
