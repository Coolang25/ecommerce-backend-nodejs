'use strict';

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
});

client.on('ready', () => {
    console.log(`Discord Logger connected as ${client.user.tag}`);
});

const token = '';
client.login(token);

client.on('messageCreate', message => {
    if (message.author.bot) return;
    if (message.content === 'hello') {
        message.reply('Hello! This is a log from the Discord Logger.');
    }
})
