import { INTEREST_RATE } from "../constants.js";

export const calculateSimpleInterest = (
  principal: number,
  tenureDays: number,
) => {
  return Number(
    ((principal * INTEREST_RATE * tenureDays) / (365 * 100)).toFixed(2),
  );
};

export const calculateRepayment = (principal: number, tenureDays: number) => {
  const interestAmount = calculateSimpleInterest(principal, tenureDays);
  return {
    interestRate: INTEREST_RATE,
    interestAmount,
    totalRepayment: Number((principal + interestAmount).toFixed(2)),
  };
};
