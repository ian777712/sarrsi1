require('dotenv').config();
const path = require('path');
const { CommandoClient } = require('discord.js-commando');
const client = new CommandoClient({
    commandPrefix: process.env.XIAO_PREFIX,
    owner: process.env.OWNERS.split(','),
    invite: process.env.INVITE,
    disableEveryone: true,
    unknownCommandResponse: false,
    disabledEvents: ['TYPING_START']
});
const activities = require('./assets/json/activity');

client.registry
    .registerDefaultTypes()
    .registerTypesIn(path.join(__dirname, 'types'))
    .registerGroups([
        ['util', 'Utility'],
        ['info', 'Discord Information'],
        ['random', 'Random Response'],
        ['single', 'Single Response'],
        ['events', 'Events'],
        ['search', 'Search'],
        ['analyze', 'Analyzers'],
        ['games', 'Games'],
        ['voice', 'Voice Channel'],
        ['image-edit', 'Image Manipulation'],
        ['avatar-edit', 'Avatar Manipulation'],
        ['text-edit', 'Text Manipulation'],
        ['number-edit', 'Number Manipulation'],
        ['other', 'Other'],
        ['roleplay', 'Roleplay']
    ])
    .registerDefaultCommands({
        help: false,
        ping: false,
        prefix: false,
        commandState: false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', () => {
    console.log(`[READY] Logged in as ${client.user.tag}! (${client.user.id})`);
    client.setInterval(() => {
        const activity = activities[Math.floor(Math.random() * activities.length)];
        client.user.setActivity(activity.text, { type: activity.type });
    }, 60000);
});

client.on('disconnect', event => {
    console.error(`[DISCONNECT] Disconnected with code ${event.code}.`);
    process.exit(0);
});

client.on('commandRun', command => console.log(`[COMMAND] Ran command ${command.groupID}:${command.memberName}.`));

client.on('error', err => console.error('[ERROR]', err));

client.on('warn', err => console.warn('[WARNING]', err));

client.on('commandError', (command, err) => console.error('[COMMAND ERROR]', command.name, err));

client.login(process.env.XIAO_TOKEN);

process.on('unhandledRejection', err => {
    console.error('[FATAL] Unhandled Promise Rejection.', err);
    process.exit(1);
});
