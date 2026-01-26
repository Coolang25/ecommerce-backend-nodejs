'use strict';

const { Client, GatewayIntentBits } = require('discord.js');
const { CHANEL_ID_DISCORD, TOKEN_DISCORD } = process.env;

class LoggerService {
    constructor() {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.DirectMessages
            ]
        });

        this.chanelId = CHANEL_ID_DISCORD;
        this.token = TOKEN_DISCORD;

        // this.client.on('ready', () => {
        //     console.log(`Discord Logger connected as ${this.client.user.tag}`);
        // });

        // this.client.login(this.token);
    }

    sendToFormatCode(logData) {
        const { code, message = 'No message provided', title = 'Code example' } = logData;

        const codeMessage = {
            content: message,
            embeds: [
                {
                    color: parseInt('00ff00', 16),
                    title,
                    description: '```json\n' + JSON.stringify(code, null, 2) + '\n```',
                }
            ]
        }
        this.sendToMessage(codeMessage);
    }

    sendToMessage(message = 'message') {
        console.log('Sending log to Discord:', this.chanelId);
        const channel = this.client.channels.cache.get(this.chanelId);
        if (!channel) {
            console.error('Channel not found!');
            return;
        }

        channel.send(message).catch(err => {
            console.error('Error sending message to Discord channel:', err);
        });
    }
}

module.exports = new LoggerService();