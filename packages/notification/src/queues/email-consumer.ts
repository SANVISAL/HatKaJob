import { logger } from '@notifications/utils/logger';
import { Channel, ConsumeMessage } from 'amqplib';
import { createQueueConnection } from './connection';
import { IEmailLocals } from '@notifications/utils/@types/email-sender.type';
import EmailSender from '@notifications/utils/email-sender';
import getConfig from '@notifications/utils/config';

// TODO:
// 1. Check If Channel Exist. If Not Create Once
// 2. Define ExchangeName, RoutingKey, QueueName
// 3. Check if Exchange Exist, If Not Create Once
// 4. Check if Queue Exist, If Not Create Once
// 5. Bind the Exchange to Queue by Routing Key
// 6. Consumer: Send Email When there is a message from Queue
export async function consumeAuthEmailMessages(
  channel: Channel
): Promise<void> {
  try {
    if (!channel) {
      channel = (await createQueueConnection()) as Channel;
    }

    const exchangeName = 'neakhatka-email-notification';
    const routingKey = 'auth-email';
    const queueName = 'auth-email-queue';

    await channel.assertExchange(exchangeName, 'direct');
    const queue = await channel.assertQueue(queueName, {
      durable: true,
      autoDelete: false,
    });
    await channel.bindQueue(queue.queue, exchangeName, routingKey);

    channel.consume(queue.queue, async (msg: ConsumeMessage | null) => {
      const {
        reciverEmail,
        // firstname,
        // lastname,
        verifyLink,
        resetLink,
        template,
      } = JSON.parse(msg!.content.toString());

      // console.log(msg?.content.toString());

      // console.log('receiver email : ', reciverEmail);
      // console.log('receiver resetLink : ', resetLink);
      // console.log('receiver template : ', template);

      const locals: IEmailLocals = {
        appLink: `${getConfig().clientUrl}`,
        appIcon: ``,
        verifyLink: `${getConfig().clientUrl}/verify-email?token=${verifyLink}`,
        //verifyLink: `http://localhost:3000/verify-email?token=${verifyLink}`,
        resetLink,
      };

      const emailUserSender = EmailSender.getInstance();
      await emailUserSender.sendEmail(template, reciverEmail, locals);

      // Acknowledgement
      channel.ack(msg!);
    });
  } catch (error) {
    logger.error(
      `NotificationService EmailConsumer consumeAuthEmailMessages() method error: ${error}`
    );
  }
}

// export async function consumeSubmissionEmailMessages(
//   channel: Channel
// ): Promise<void> {
//   try {
//     if (!channel) {
//       channel = (await createQueueConnection()) as Channel;
//     }

//     const exchangeName = 'microsample-submission-notification';
//     const routingKey = 'submission-email';
//     const queueName = 'submission-email-queue';

//     await channel.assertExchange(exchangeName, 'direct');
//     const queue = await channel.assertQueue(queueName, {
//       durable: true,
//       autoDelete: false,
//     });
//     await channel.bindQueue(queue.queue, exchangeName, routingKey);

//     channel.consume(queue.queue, async (msg: ConsumeMessage | null) => {

//     });
//   } catch (error) {
//     logger.error(
//       `NotificationService EmailConsumer consumeAuthEmailMessages() method error: ${error}`
//     );
//   }
// }
