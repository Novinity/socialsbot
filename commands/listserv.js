const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listserv')
        .setDescription('Dev command'),
    async execute(interaction, client) {
        if (interaction.user.id.toString() === "860838128444637204") {
            interaction.reply({ content: client.guilds.cache.map(guild => guild.name).join("\n"), ephemeral: true });
        }
    }
}