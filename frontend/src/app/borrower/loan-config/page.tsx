import { LoanCalculator } from "@/components/LoanCalculator";
import { MultiStepForm } from "@/components/MultiStepForm";

export default function LoanConfigPage() {
  return (
    <>
      <MultiStepForm active="Loan Config" />
      <h1 className="mb-4 text-2xl font-bold">Loan Configuration</h1>
      <LoanCalculator />
    </>
  );
}
