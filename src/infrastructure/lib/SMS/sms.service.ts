import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  SmsServiceInterface,
  SendSmsErrorResponse,
  SendSmsParams,
  SendSmsResponse,
  SmsStatusErrorResponse,
  SmsStatusParams,
  SmsStatusResponse,
  getUnixTimeInSeconds,
  generateMd5Hash,
} from '../../../common';
import { config } from 'src/config';

@Injectable()
export class SmsService implements SmsServiceInterface {
  private clientUsername: string;
  private sayqalSmsSendURL: string;
  private clientSecret: string;

  constructor(private readonly httpService: HttpService) {
    this.clientUsername = config.NASIYA_CLIENT_USERNAME;
    this.sayqalSmsSendURL = config.NASIYA_SMS_SEND_URL;
    this.clientSecret = config.SMS_CLIENT_SECRET;
  }

  async sendSms(
    sendSmsParams: SendSmsParams,
  ): Promise<SendSmsResponse | SendSmsErrorResponse> {
    try {
      const randomSmsId = Math.floor(10000 + Math.random() * 90000);

      const smsMessage = {
        ...sendSmsParams,
        smsid: randomSmsId,
      };

      const headers = this.getRequestHeaders();

      const request = this.httpService.post(
        this.sayqalSmsSendURL + '/TransmitSMS',
        {
          message: smsMessage,
          utime: getUnixTimeInSeconds(),
          service: {
            service: 1,
          },
          username: this.clientUsername,
        },
        { headers: headers },
      );

      const response = await firstValueFrom(request);

      if (response.data?.error) {
        throw new Error(response.data?.error);
      }

      return response.data;
    } catch (err) {
      console.error('SmsService.sendSms: ', err);
      throw new Error();
    }
  }

  async getSmsStatus(
    params: SmsStatusParams,
  ): Promise<SmsStatusResponse | SmsStatusErrorResponse> {
    throw new Error('Method not implemented.');
  }

  private getRequestHeaders() {
    const accessToken = generateMd5Hash(
      `TransmitSMS ${this.clientUsername} ${this.clientSecret} ${getUnixTimeInSeconds()}`,
    );

    const headers = {
      'Content-Type': 'application/json',
      'X-Access-Token': accessToken,
    };

    return headers;
  }
}
