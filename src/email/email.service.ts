import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';
import { EmailConfig } from './constants/email.constants';
import { Email } from './types/index';

@Injectable()
export class EmailService {
  constructor(private configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  async send(props: Email) {
    const transport = await SendGrid.send({
      from: { email: props.from?.email ?? EmailConfig.from.email, name: props.from?.name ?? EmailConfig.from.name },
      to: props.to,
      replyTo: props.replyTo ?? EmailConfig.replyTo,
      subject: props.subject,
      templateId: props.templateId,
      dynamicTemplateData: { ...props.dynamicTemplateData, subject: props.subject },
    });
    return transport;
  }
}
