import { ObjectId } from "mongoose";

export interface Currency {
  name: string;
  symbol: string;
  decimals: number;
  _id: ObjectId;
}