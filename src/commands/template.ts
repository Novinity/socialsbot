import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder().setName("template").setDescription("This is a template command."),
    permissions: [],
    requireAllPermissions: false,
    async execute(interaction: ChatInputCommandInteraction) {
        // Execution goes here
    }
}