import EmailSender from '../email-sender';
import APIError from '../../errors/api-error';
import { EmailApi } from '../@types/email-sender.type';

describe('EmailSender', () => {
  let emailApi: EmailApi;

  beforeEach(() => {
    EmailSender.resetEmailSenderInstance();
    emailApi = { sendEmail: jest.fn().mockResolvedValue(undefined) };
  });

  test('should always return the same instance', () => {
    expect(EmailSender.getInstance()).toBe(EmailSender.getInstance());
  });

  test('should refuse to send while inactive', async () => {
    const sender = EmailSender.getInstance();
    sender.setEmailApi(emailApi);

    await expect(
      sender.sendEmail('verifyEmail', 'a@test.com', {})
    ).rejects.toThrow(new APIError('EmailSender is not active'));
    expect(emailApi.sendEmail).not.toHaveBeenCalled();
  });

  test('should refuse to send without an email API', async () => {
    const sender = EmailSender.getInstance();
    sender.activate();

    await expect(
      sender.sendEmail('verifyEmail', 'a@test.com', {})
    ).rejects.toThrow('EmailApi is not set');
  });

  test('should hand the email to the configured API when active', async () => {
    const sender = EmailSender.getInstance();
    sender.activate();
    sender.setEmailApi(emailApi);
    const locals = { verifyLink: 'http://app/verify-email?token=abc' };

    await sender.sendEmail('verifyEmail', 'a@test.com', locals);

    expect(emailApi.sendEmail).toHaveBeenCalledWith(
      'verifyEmail',
      'a@test.com',
      locals
    );
  });

  test('should stop sending after being deactivated', async () => {
    const sender = EmailSender.getInstance();
    sender.activate();
    sender.setEmailApi(emailApi);
    sender.deactivate();

    await expect(
      sender.sendEmail('verifyEmail', 'a@test.com', {})
    ).rejects.toBeInstanceOf(APIError);
  });
});
