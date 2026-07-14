import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Get the link to invite the bot to your server'),
    permissions: [],
    requireAllPermissions: false,
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.reply({ content: "[Click here to invite me to your server!](https://canary.discord.com/api/oauth2/authorize?client_id=1182053109086830633&permissions=2147675136&scope=bot)", flags: "Ephemeral" });
    }
}