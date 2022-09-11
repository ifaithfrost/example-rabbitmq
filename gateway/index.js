import express from 'express'
import { connect } from 'amqplib'

export class RabbitmqServer {
  constructor(uri) {
    this.uri = uri
  }

  async start() {
    this.conn = await connect(this.uri)
    this.channel = await this.conn.createChannel()
  }

  async publishInQueue(queue, message) {
    return this.channel.sendToQueue(queue, Buffer.from(message))
  }

  async publishInExchange(
    exchange,
    routingKey,
    message
  ) {
    return this.channel.publish(exchange, routingKey, Buffer.from(message))
  }

  async consume(queue, callback) {
    return this.channel.consume(queue, (message) => {
      callback(message)
      this.channel.ack(message)
    });
  }
}

const app = express()
const server = new RabbitmqServer('amqp://admin:admin@rabbitmq:5672');

app.get('/', async (req, res) => {
  
  await server.start();
  await server.publishInQueue('my-service', JSON.stringify({ name: "Ítalo"}));
})

app.listen(3003)