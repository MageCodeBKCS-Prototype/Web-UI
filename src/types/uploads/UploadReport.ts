import { UploadReportStatus } from "./UploadReportStatus";
import { ReportFile } from "./ReportFile";
import { MachineCodeDetectionStatus } from "./MachineCodeDetectionStatus";

export type UploadReport = {
  name: string;
  date: string;
  status: UploadReportStatus;
  statusUrl: string;
  response?: Record<string, any>;
  stderr?: string;

  // Report ID is the ID of the report, as received from the server.
  // This is used to identify the report in the server.
  reportId: string;

  // Reference ID is the local ID of the report.
  // It is generated using a slug of the report name and a incrementing number.
  // This is used to identify the report in the local storage.
  referenceId: string;

  // Is a report generated by the user.
  // Or is it an opened shared report.
  isFromSharing: boolean;
  report_file: ReportFile[];
  machine_code_detect_status: MachineCodeDetectionStatus;
};
