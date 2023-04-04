import nodemailer, { Transporter, TransportOptions } from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";
import { MAIL_CONFIG, MAIL_FROM, FRONTEND_URL, APPLICATION_NAME } from "../config";
import fs from "fs";
import path from "path";

const BASE_TEMPLATE = "../templates/email/base.html";
const GENERIC_TEMPLATE = "../templates/email/generic.html";

export class EmailService {
  transport: Transporter;

  constructor() {
    this.transport = nodemailer.createTransport(MAIL_CONFIG as TransportOptions);
  }

  // this method should be duplicated and customized for each email type with a different template
  async sendTemplateEmail(recipient: { fullName: string; email: string }, action: string): Promise<any> {
    let templatePath = path.join(__dirname, GENERIC_TEMPLATE);
    let content = fs.readFileSync(templatePath).toString();
    content = content.replace(/``ACTION_NAME``/, action);
    await this.sendEmail(recipient.fullName, recipient.email, "Template email", content);
  }

  async verify(): Promise<any> {
    return this.transport
      .verify()
      .then((response) => {
        return { connection: true };
      })
      .catch((error) => {
        console.log("Mailer verify error:", error);
        return { connection: false, error };
      });
  }

  async sendEmail(toName: string, toEmail: string, subject: string, customContent: string): Promise<any> {
    let basePath = path.join(__dirname, BASE_TEMPLATE);
    let baseContent = fs.readFileSync(basePath).toString();

    baseContent = baseContent.replace(/``CUSTOM_CONTENT``/, customContent);
    baseContent = baseContent.replace(/``APPLICATION_URL``/g, FRONTEND_URL);
    baseContent = baseContent.replace(/``APPLICATION_NAME``/g, APPLICATION_NAME);
    baseContent = baseContent.replace(/``TO_NAME``/g, toName);
    baseContent = baseContent.replace(/``TO_EMAIL``/g, toEmail);

    let message: MailOptions = {
      from: MAIL_FROM,
      to: `"${toName}" <${toEmail}>`,
      subject: `${subject} : ${APPLICATION_NAME}`,
      html: baseContent,
    };

    if (!toEmail || toEmail.length == 0) {
      console.log("Not sending email to " + toName + " without an email address");
      return null;
    }

    return this.transport.sendMail(message);
  }
}
