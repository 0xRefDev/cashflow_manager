import { ObjectId } from "mongoose";

export interface Currency {
  name: string;
  symbol: string;
  _id: ObjectId;
}