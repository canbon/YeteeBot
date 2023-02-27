const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const yeteeutil = require("../yeteeutil.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shirts')
		.setDescription('Yop Yop! Gets you the latest shirts from theyetee.com!'),
	async execute(interaction) {
		shirts = await yeteeutil.getShirts();
        let embed1 = new EmbedBuilder().setTitle("Yop Yop! New Yetee shirts coming your way!").setURL('https://theyetee.com').setImage('https://someimagelink.jpg')
        let embed2 = new EmbedBuilder().setURL('https://theyetee.com').setImage(`${shirts[0]}`)
        let embed3 = new EmbedBuilder().setURL('https://theyetee.com').setImage(`${shirts[1]}`)
        //TODO: change send to reply
        await interaction.reply({embeds: [embed1, embed2, embed3]});
	},
};