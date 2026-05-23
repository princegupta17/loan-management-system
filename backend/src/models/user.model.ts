import bcrypt from "bcrypt";
import mongoose, { Document, Model, Schema, Types } from "mongoose";
import { USER_ROLES } from "../constants.js";

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
export type EmploymentMode = "Salaried" | "Self-Employed" | "Unemployed";

export interface IUser extends Document {
  _id: Types.ObjectId;
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  pan?: string;
  dob?: Date;
  monthlySalary?: number;
  employmentMode?: EmploymentMode;
  salarySlipPath?: string;
  personalDetailsCompleted: boolean;
  documentsUploaded: boolean;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.BORROWER,
      required: true,
    },
    pan: { type: String, uppercase: true, trim: true },
    dob: Date,
    monthlySalary: Number,
    employmentMode: {
      type: String,
      enum: ["Salaried", "Self-Employed", "Unemployed"],
    },
    salarySlipPath: String,
    personalDetailsCompleted: { type: Boolean, default: false },
    documentsUploaded: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function comparePassword(
  password: string,
) {
  return bcrypt.compare(password, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
