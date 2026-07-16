import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder().setName("ls").setDescription("Dev command")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    permissions: [],
    requireAllPermissions: false,
    async execute(interaction: ChatInputCommandInteraction) {
        const client = interaction.client;
        if (interaction.user.id.toString() === "860838128444637204") {
            console.log(`${client.guilds.cache.size} SERVERS:`);
            let final = "";
            client.guilds.cache.forEach(element => {
                final += `${element.name} (${element.id}) - ${element.memberCount}\n`;
            });
            console.log(final);
            await interaction.reply({content: "Logged.", flags: "Ephemeral"});
        }
    }
}