import { ChatInputCommandInteraction, Events, MessageFlags, PermissionsBitField } from "discord.js";

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction: ChatInputCommandInteraction) {
       if (!interaction.isChatInputCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            if ("permissions" in command && command.permissions.length > 0) {
                const guildMember = await interaction.guild?.members.fetch(interaction.user.id);
                const requireAllPermissions = "requireAllPermissions" in command && command.requireAllPermissions;
                let hasPermission = false;
                if (requireAllPermissions) {
                    for (const permission in command.permissions) {
                        if (guildMember.permissions.has(permission as unknown as PermissionsBitField)) {
                            hasPermission = true;
                            break;
                        }
                    }
                } else {
                    if (guildMember.permissions.has(command.permissions)) {
                        hasPermission = true;
                    }
                }

                if (!hasPermission) {
                    await interaction.reply({
                        content: "You do not have the required permission(s) to execute this command.",
                        flags: MessageFlags.Ephemeral
                    });
                    return;
                }
            }
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "There was an error while executing this command.",
                    flags: MessageFlags.Ephemeral
                });
            } else {
                await interaction.reply({
                    content: "There was an error executing this command.",
                    flags: MessageFlags.Ephemeral
                });
            }
        }
    }
}