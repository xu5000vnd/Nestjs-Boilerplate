import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'
import * as handlebars from 'handlebars'
import { readFileSync } from 'fs'
import { MAIL_TEMPLATE_PATH } from 'src/common/constants/mailer.constant'
import { ParameterEmailType } from './type/mail.type'

@Injectable()
export class MailerService {
  private transporter: nodemailer.Transporter

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('mailer.host'),
      port: configService.get('mailer.port'),
      secure: false,
      auth: {
        user: configService.get('mailer.auth.username'),
        pass: configService.get('mailer.auth.password'),
      },
    })
  }

  async sendMail(params: ParameterEmailType): Promise<void> {
    const { to, subject, template, variables = {} } = params
    const templatePath = `${MAIL_TEMPLATE_PATH}/${template}.hbs`
    const templateContent = readFileSync(templatePath, 'utf-8')
    const html = handlebars.compile(templateContent)(variables)
    const mailOptions: nodemailer.SendMailOptions = {
      from: 'xu1000vnd@gmail.com',
      to,
      subject,
      html,
    }
    if (!this.configService.get('mailer.host')) {
      return
    }
    await this.transporter.sendMail(mailOptions)
  }
}
