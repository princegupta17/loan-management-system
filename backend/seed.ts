import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./src/db/index.js";
import { USER_ROLES } from "./src/constants.js";
import { User } from "./src/models/user.model.js";
import { Loan } from "./src/models/loan.model.js";
import { Payment } from "./src/models/payment.model.js";

dotenv.config();

const users = [
  { fullName: "Admin User", email: "admin@lms.com", role: USER_ROLES.ADMIN },
  {
    fullName: "Sales Executive",
    email: "sales@lms.com",
    role: USER_ROLES.SALES,
  },
  {
    fullName: "Sanction Executive",
    email: "sanction@lms.com",
    role: USER_ROLES.SANCTION,
  },
  {
    fullName: "Disbursement Executive",
    email: "disbursement@lms.com",
    role: USER_ROLES.DISBURSEMENT,
  },
  {
    fullName: "Collection Executive",
    email: "collection@lms.com",
    role: USER_ROLES.COLLECTION,
  },
  {
    fullName: "Borrower User",
    email: "borrower@lms.com",
    role: USER_ROLES.BORROWER,
  },
];

const run = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany({}),
    Loan.deleteMany({}),
    Payment.deleteMany({}),
  ]);

  for (const user of users) {
    await User.create({
      ...user,
      password: "Password@123",
    });
  }

  console.log("Seed completed. All accounts use password: Password@123");
  console.table(
    users.map(({ fullName, email, role }) => ({ fullName, email, role })),
  );
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
