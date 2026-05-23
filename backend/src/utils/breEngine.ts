import { ApiError } from "./ApiError.js";

export const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

export interface BreInput {
  pan: string;
  dob: string | Date;
  monthlySalary: number;
  employmentMode: "Salaried" | "Self-Employed" | "Unemployed";
}

const getAge = (dob: Date) => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDelta = today.getMonth() - dob.getMonth();
  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < dob.getDate())) {
    age -= 1;
  }
  return age;
};

export const runBre = (input: BreInput) => {
  const errors: string[] = [];
  const dob = new Date(input.dob);

  if (Number.isNaN(dob.getTime())) {
    errors.push("Date of birth is invalid.");
  } else {
    const age = getAge(dob);
    if (age < 23 || age > 50) {
      errors.push("Age must be between 23 and 50 years.");
    }
  }

  if (input.monthlySalary < 25000) {
    errors.push("Monthly salary must be at least Rs. 25,000.");
  }

  if (!PAN_REGEX.test(input.pan.toUpperCase())) {
    errors.push("PAN must follow the valid format, for example ABCDE1234F.");
  }

  if (input.employmentMode === "Unemployed") {
    errors.push("Unemployed applicants are not eligible.");
  }

  if (errors.length) {
    throw new ApiError(422, "BRE eligibility failed", errors);
  }

  return { eligible: true };
};
