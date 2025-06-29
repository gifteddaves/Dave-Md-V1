require('../settings');
const chalk = require('chalk');
const { getContentType, downloadContentFromMessage, jidNormalizedUser } = require('@whiskeysockets/baileys');

// Handle group metadata events
async function GroupUpdate(conn, update) {
  console.log(chalk.yellow('[GROUP UPDATE]:'), update);
}

// Handle group participant updates
async function GroupParticipantsUpdate(conn, update) {
  console.log(chalk.blue('[PARTICIPANT UPDATE]:'), update);
}

// Main message handler
async function MessagesUpsert(conn, m, store) {
  try {
    if (!m.type || m.type !== 'notify') return;

    for (const msg of m.messages) {
      if (!msg.message || msg.key.remoteJid === 'status@broadcast') continue;

      const contentType = getContentType(msg.message);
      const message = msg.message[contentType];
      const from = msg.key.remoteJid;
      const isGroup = from.includes('@g.us');
      const sender = isGroup ? msg.key.participant : msg.key.remoteJid;
      const prefix = '.';

      let text = '';
      if (contentType === 'conversation') text = message;
      else if (contentType === 'extendedTextMessage') text = message.text || message.extendedTextMessage?.text;
      else continue;

      const cmd = text.trim().toLowerCase();

      // 💠 Menu Command
      if (cmd === `${prefix}menu`) {
        const menuImage = 'https://files.catbox.moe/p57bie.jpg';
        const menuText = `
╭─❖ *𝗗𝗔𝗩𝗘-𝗠𝗗-𝗩𝟭* ❖─╮
│ *🔘 WhatsApp Bot Menu*
╰─────────────❖

*╭─❖ ᴏᴡɴᴇʀ ᴍᴇɴᴜ ❖─╮*
│ ⿻ ${prefix}setppbot
│ ⿻ ${prefix}setprefix
│ ⿻ ${prefix}shutdown
│ ⿻ ${prefix}bc
│ ⿻ ${prefix}join
*╰─────────────❖*

*╭─❖ ɢʀᴏᴜᴘ ᴍᴇɴᴜ ❖─╮*
│ ⿻ ${prefix}add
│ ⿻ ${prefix}kick
│ ⿻ ${prefix}promote
│ ⿻ ${prefix}demote
│ ⿻ ${prefix}setname
│ ⿻ ${prefix}setdesc
*╰─────────────❖*

*╭─❖ ᴅᴏᴡɴʟᴏᴀᴅ ᴍᴇɴᴜ ❖─╮*
│ ⿻ ${prefix}ytmp3
│ ⿻ ${prefix}ytmp4
│ ⿻ ${prefix}tiktok
│ ⿻ ${prefix}instagram
*╰─────────────❖*

*╭─❖ ᴀɴɪᴍᴇ ᴍᴇɴᴜ ❖─╮*
│ ⿻ ${prefix}anime
│ ⿻ ${prefix}manga
│ ⿻ ${prefix}neko
│ ⿻ ${prefix}waifu
*╰─────────────❖*

*╭─❖ ᴏᴛʜᴇʀ ᴍᴇɴᴜ ❖─╮*
│ ⿻ ${prefix}ping
│ ⿻ ${prefix}owner
│ ⿻ ${prefix}report
│ ⿻ ${prefix}runtime
*╰─────────────❖*

🔗 *Owner*: wa.me/254104260236
🧠 *Bot*: Dave-Md-V1
        `;

        await conn.sendMessage(from, {
          image: { url: menuImage },
          caption: menuText,
        }, { quoted: msg });
      }

      // ✅ Ping command
      if (cmd === `${prefix}ping`) {
        const start = Date.now();
        const end = Date.now();
        await conn.sendMessage(from, {
          text: `🏓 *Pong!* • ${end - start}ms\n🧠 Dave-Md-V1`,
        }, { quoted: msg });
      }

      // You can add more commands here...
    }
  } catch (err) {
    console.error(chalk.red('[❌ ERROR in Message Handler]'), err);
  }
}

// Called when bot starts
async function Solving(conn, store) {
  console.log(chalk.green('[✅ DAVE-MD-V1] Bot is ready and listening...'));
}

// Export functions
module.exports = {
  MessagesUpsert,
  GroupUpdate,
  GroupParticipantsUpdate,
  Solving
};
