const colors = require('../UI/colors/colors');
const client = require('../main');

function printBox({ title, lines, color = colors.cyan }) {
    console.log('\n' + '─'.repeat(60));
    console.log(`${color}${colors.bright}${title}${colors.reset}`);
    console.log('─'.repeat(60));

    lines.forEach(line => {
        console.log(`${color}${line}${colors.reset}`);
    });

    console.log('─'.repeat(60) + '\n');
}

async function initializeBot() {
    const BOT_ID = client.user?.id || 'UNKNOWN_BOT';

    printBox({
        title: '[ ✅ Bot Initialization ]',
        lines: [
            `Bot ID: ${BOT_ID}`,
            'BOT_API verification has been disabled.',
            'Your bot is ready to go!'
        ],
        color: colors.green
    });

    return true;
}

module.exports = initializeBot;
