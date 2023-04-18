export type Email = {
  from?: {
    email: string;
    name: string;
  };
  to: string;
  replyTo?: string;
  subject: string;
  templateId?: string;
  dynamicTemplateData?: any;
};
