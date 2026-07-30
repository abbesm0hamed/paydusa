import { EmailTemplate, emailSubjects, renderTemplate } from "@ecommerce/email";
import {
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
  Logger,
} from "@medusajs/framework/types";
import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils";
import { Resend } from "resend";

type ResendOptions = {
  api_key: string;
  from: string;
  html_templates?: Record<
    string,
    {
      subject?: string;
      content: string;
    }
  >;
};

type InjectedDependencies = {
  logger: Logger;
};

class ResendNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "notification-resend";
  private resendClient: Resend;
  private options: ResendOptions;
  private logger: Logger;

  constructor({ logger }: InjectedDependencies, options: ResendOptions) {
    super();
    this.resendClient = new Resend(options.api_key);
    this.options = options;
    this.logger = logger;
  }

  static validateOptions(options: Record<any, any>) {
    if (!options.api_key) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Option `api_key` is required in the provider's options."
      );
    }
    if (!options.from) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Option `from` is required in the provider's options."
      );
    }
  }

  getTemplateSubject(template: EmailTemplate) {
    if (this.options.html_templates?.[template]?.subject) {
      return this.options.html_templates[template].subject;
    }
    return emailSubjects[template] || "New Email";
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    const template = notification.template as EmailTemplate;

    if (
      !(template in emailSubjects) &&
      !this.options.html_templates?.[template]
    ) {
      this.logger.error(
        `Couldn't find an email template for ${notification.template}. The valid options are ${Object.keys(emailSubjects).join(", ")}`
      );
      return {};
    }

    const commonOptions = {
      from: this.options.from,
      to: [notification.to],
      subject: this.getTemplateSubject(template),
    };

    let html: string;

    if (this.options.html_templates?.[template]) {
      html = this.options.html_templates[template].content;
    } else {
      try {
        html = await renderTemplate(template, notification.data);
      } catch (error) {
        this.logger.error(
          `Failed to render email template ${template}`,
          error as Error
        );
        return {};
      }
    }

    const { data, error } = await this.resendClient.emails.send({
      ...commonOptions,
      html,
    });

    if (error || !data) {
      if (error) {
        this.logger.error("Failed to send email", error);
      } else {
        this.logger.error("Failed to send email: unknown error");
      }
      return {};
    }

    return { id: data.id };
  }
}

export default ResendNotificationProviderService;
