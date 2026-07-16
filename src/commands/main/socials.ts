import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("socials")
        .setDescription("List the socials of the guild or target user.")
        .addMentionableOption(option => 
            option
                .setName('user')
                .setDescription('User to list the socials of')
                .setRequired(false)),
    permissions: [],
    requireAllPermissions: false,
    async execute(interaction: ChatInputCommandInteraction) {
        const sql = interaction.client.sql;
        const user = interaction.options.getUser('user') ?? null;
        const targetId = user ? user.id : interaction.guild?.id;

        if (!targetId) {
            await interaction.reply({
                content: "Failed to get ID to target.",
                flags: "Ephemeral"
            });
            return;
        }

        const res = await sql`SELECT * FROM socials WHERE linked_id = ${targetId}`;
        if (!res) {
            await interaction.reply({
                content: `Failed to retrieve socials.`,
                flags: "Ephemeral"
            });
            return;
        }

        if (res.length === 0) {
            await interaction.reply({
                content: `This ${user ? "user" : "server"} has not set any socials yet.`,
                flags: "Ephemeral"
            });
            return;
        }

        let finalMsg = "";
        res.forEach((element: any) => {
            finalMsg += "["+element.name+"]("+element.url+")\n"; 
        });
    
        const embed = new EmbedBuilder()
            .setColor(0x88FF8A)
            .setTitle("Socials for " + (user ? user?.globalName : interaction.guild?.name))
            .addFields(
                { name: "Links", value: finalMsg }
            )
            .setThumbnail((user ? user.avatarURL() : interaction.guild?.iconURL()) || interaction.client.user.avatarURL())
            .setFooter({ text: "It is recommended that you double check the URL you click, just in case!" });

        await interaction.reply({ embeds: [embed], flags: "Ephemeral" });
        console.log(`${interaction.user.username} (${interaction.user.id}) viewed the socials of ${user ? user.username : interaction.guild?.name} (${user ? user.id : interaction.guild?.id})`);
    }
}