import Link from "next/link";

const steps = [
  { href: "/borrower/personal-details", label: "Personal Details" },
  { href: "/borrower/upload-documents", label: "Upload Documents" },
  { href: "/borrower/loan-config", label: "Loan Config" },
  { href: "/borrower/dashboard", label: "Dashboard" },
];

export function MultiStepForm({ active }: { active: string }) {
  return (
    <div className="mb-6 grid gap-2 sm:grid-cols-4">
      {steps.map((step, index) => (
        <Link
          key={step.href}
          href={step.href}
          className={`rounded-md border px-3 py-2 text-sm font-semibold ${active === step.label ? "border-ink bg-ink text-white" : "border-zinc-200 bg-white"}`}
        >
          {index + 1}. {step.label}
        </Link>
      ))}
    </div>
  );
}
