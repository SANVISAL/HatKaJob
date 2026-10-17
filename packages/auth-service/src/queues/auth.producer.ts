import { Channel } from "amqplib";
import { logger } from "../utils/logger";
import { createQueueConnection } from "./connection";

export async function publishDirectMessage(
  channel: Channel | undefined, // Change type to allow for undefined
  exchangeName: string,
  routingKey: string,
  message: string,
  logMessage: string
): Promise<void> {
  try {
    if (!channel) {
      channel = await createQueueConnection(); // No need to cast here
    }

    if (channel) {
      await channel.assertExchange(exchangeName, "direct");
      channel.publish(exchangeName, routingKey, Buffer.from(message));
      logger.info(logMessage);
    } else {
      logger.error("Channel is undefined");
    }
  } catch (error) {
    logger.error(
      `AuthService Provider publishDirectMessage() method error`,
      error
    );
  }
}
