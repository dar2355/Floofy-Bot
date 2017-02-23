const { Command } = require('discord.js-commando');
const guildSettings = require('../../dataProviders/postgreSQL/models/GuildSettings');

module.exports = class ViewConfigCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'viewconfig',
			group: 'config',
			memberName: 'viewconfig',
			description: 'Displays configuration for the server.',
			guildOnly: true
		});
	}

	hasPermission(msg) {
		return msg.member.hasPermission('MANAGE_GUILD');
	}

	async run(msg) {
		let settings = await guildSettings.findOne({ where: { guildID: msg.guild.id } });
		if (!settings) settings = await guildSettings.create({ guildID: msg.guild.id });
		let out = '';
		Object.keys(settings.dataValues).forEach(key => {
			if (key !== 'id' && key !== 'guildID' && key !== 'createdAt' && key !== 'updatedAt') out += `${key}: ${JSON.stringify(settings.dataValues[key])}\n`;
		});
		return msg.channel.sendCode('JSON', out);
	}
};
