import { FileUpload } from "@/components/FileUpload";
import { MultiStepForm } from "@/components/MultiStepForm";

export default function UploadDocumentsPage() {
  return (
    <>
      <MultiStepForm active="Upload Documents" />
      <h1 className="mb-4 text-2xl font-bold">Upload Salary Slip</h1>
      <FileUpload />
    </>
  );
}
