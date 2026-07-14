import { ChatInputCommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, User } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder().setName("help").setDescription("Get info on commands"),
    permissions: [],
    requireAllPermissions: false,
    async execute(interaction: ChatInputCommandInteraction) {
        const embed = new EmbedBuilder()
            .setColor(0x88FF8A)
            .setTitle("Help")
            .addFields(
                { name: "User Commands", value: "``/socials`` - Display the socials for either the specified user, or the server.\n``/addsocial`` - Add a social to your personal list\n``/removesocial`` - Remove social from your personal list." },
                { name: "Server Commands", value: "``/addsocial`` - Add a social to the server's list.\n``/removesocial`` - Remove social from the server's list."},
                { name: "Other", value: "``/invite`` - Get the link to invite the bot to your server." }
            )
            .setThumbnail(interaction.guild?.iconURL() || interaction.client.user.avatarURL());
        
        interaction.reply({ embeds: [embed], flags: "Ephemeral" });
    }
}