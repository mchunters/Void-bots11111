const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

module.exports = async (client, config, colors) => {
    const commandsPath = path.join(__dirname, '../commands');

    const commandFolders = fs.readdirSync(commandsPath);
    const enabledCommandFolders = commandFolders.filter(
        folder => config.categories[folder]
    );

    const commands = [];
    const commandNames = new Set();

    for (const folder of enabledCommandFolders) {
        const folderPath = path.join(commandsPath, folder);

        if (!fs.statSync(folderPath).isDirectory()) continue;

        const commandFiles = fs.readdirSync(folderPath)
            .filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            try {
                const commandPath = path.join(folderPath, file);
                const command = require(commandPath);

                if (!command?.data?.name) {
                    console.log(
                        `${colors.yellow}[ WARNING ]${colors.reset} Skipping invalid command: ${folder}/${file}`
                    );
                    continue;
                }

                const commandName = command.data.name.toLowerCase();

                // Prevent duplicate slash commands
                if (commandNames.has(commandName)) {
                    console.log(
                        `${colors.yellow}[ DUPLICATE ]${colors.reset} Skipping duplicate command: /${commandName} (${folder}/${file})`
                    );
                    continue;
                }

                commandNames.add(commandName);
                client.commands.set(commandName, command);
                commands.push(command.data.toJSON());

            } catch (error) {
                console.log(
                    `${colors.red}[ COMMAND ERROR ]${colors.reset} ${folder}/${file}`
                );
                console.error(error);
            }
        }
    }

    const token = process.env.TOKEN || config.token;

    if (!token) {
        console.error(
            `${colors.red}[ ERROR ] No Discord bot token found.${colors.reset}`
        );
        return;
    }

    const rest = new REST({ version: '10' }).setToken(token);

    try {
        console.log('\n' + '─'.repeat(40));
        console.log(
            `${colors.yellow}${colors.bright}⚡ SLASH COMMANDS${colors.reset}`
        );
        console.log('─'.repeat(40));

        console.log(
            `${colors.cyan}[ LOADER ]${colors.reset} Found ${commands.length} unique slash commands.`
        );

        await rest.put(
            Routes.applicationCommands(client.user.id),
            {
                body: commands
            }
        );

        console.log(
            `${colors.green}[ LOADER ] Successfully Loaded ${commands.length} Slash Commands ✅${colors.reset}`
        );

        console.log('─'.repeat(40) + '\n');

    } catch (error) {
        console.log(
            `${colors.red}[ ERROR ] Failed to register slash commands:${colors.reset}`
        );
        console.error(error);
    }
};
