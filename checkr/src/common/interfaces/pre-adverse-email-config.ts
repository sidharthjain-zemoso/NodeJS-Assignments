// Interface for email configuration
export interface EmailConfig {
    fromEmail: string;
    toEmail: string;
    subject: string;
    body: string;
    count: number;
    days: number;
    candidateId?: number;
}