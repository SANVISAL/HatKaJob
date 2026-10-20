import { Channel, ConsumeMessage } from 'amqplib';
import { consumeAuthEmailMessages } from '../email-consumer';
import EmailSender from '@notifications/utils/email-sender';

const mockSendEmail = jest.fn();

jest.mock('@notifications/utils/config', () => ({
  __esModule: true,
  default: () => ({ clientUrl: 'https://neakhatka.test' }),
}));
jest.mock('@notifications/utils/email-sender', () => ({
  __esModule: true,
  default: { getInstance: jest.fn(() => ({ sendEmail: mockSendEmail })) },
}));
jest.mock('@notifications/utils/logger', () => ({
  logger: { error: jest.fn(), info: jest.fn() },
}));
jest.mock('../connection', () => ({ createQueueConnection: jest.fn() }));

const createChannel = () => {
  let handler: ((msg: ConsumeMessage | null) => Promise<void>) | undefined;
  const channel = {
    assertExchange: jest.fn(),
    assertQueue: jest.fn().mockResolvedValue({ queue: 'auth-email-queue' }),
    bindQueue: jest.fn(),
    consume: jest.fn((_queue, onMessage) => {
      handler = onMessage;
    }),
    ack: jest.fn(),
  };
  return {
    channel,
    deliver: (body: object) => {
      const msg = { content: Buffer.from(JSON.stringify(body)) } as ConsumeMessage;
      return handler!(msg).then(() => msg);
    },
  };
};

describe('consumeAuthEmailMessages', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should bind auth-email-queue to the email exchange', async () => {
    const { channel } = createChannel();

    await consumeAuthEmailMessages(channel as unknown as Channel);

    expect(channel.assertExchange).toHaveBeenCalledWith(
      'neakhatka-email-notification',
      'direct'
    );
    expect(channel.bindQueue).toHaveBeenCalledWith(
      'auth-email-queue',
      'neakhatka-email-notification',
      'auth-email'
    );
  });

  test('should send the verification email and ack the message', async () => {
    const { channel, deliver } = createChannel();
    await consumeAuthEmailMessages(channel as unknown as Channel);

    const msg = await deliver({
      reciverEmail: 'visal@test.com',
      verifyLink: 'token-123',
      template: 'verifyEmail',
    });

    expect(EmailSender.getInstance).toHaveBeenCalled();
    expect(mockSendEmail).toHaveBeenCalledWith(
      'verifyEmail',
      'visal@test.com',
      expect.objectContaining({
        appLink: 'https://neakhatka.test',
        verifyLink: 'https://neakhatka.test/verify-email?token=token-123',
      })
    );
    expect(channel.ack).toHaveBeenCalledWith(msg);
  });
});
