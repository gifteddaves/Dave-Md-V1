console.log('🟢 index.js booting...');

const express = require('express');
const fs = require('fs');
const path = require('path');
const {
  default: makeWASocket,
  useSingleFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys');
const db = require('./db');

const app = express();
app.use(express.json());

// === Root Route ===
app.get('/', (req, res) => {
  res.send('🎉 Gifted Session Backend is Running!');
});

// === Session Folder Setup ===
const sessionFolder = path.join(__dirname, 'session');
if (!fs.existsSync(sessionFolder)) fs.mkdirSync(sessionFolder);

const authFile = path.join(sessionFolder, 'auth.json');
const { state, saveState } = useSingleFileAuthState(authFile);

// === Config ===
const OWNER_NUMBER = process.env.OWNER_NUMBER || '254104260236@s.whatsapp.net';
const PREFIX = process.env.PREFIX || '.';

// === Plugin Loader ===
const plugins = [];
const pluginsPath = path.join(__dirname, 'plugins');
if (fs.existsSync(pluginsPath)) {
  const files = fs.readdirSync(pluginsPath).filter(f => f.endsWith('.js'));
  for (const file of files) {
    const plugin = require(`./plugins/${file}`);
    plugins.push(plugin.default || plugin);
  }
}

// === Pair Code API ===
app.post('/api/pair', async (req, res) => {
  const { number } = req.body;
  if (!number) return res.status(400).json({ error: 'Number is required' });

  try {
    const sessionFile = path.join(sessionFolder, `session-${number}.json`);
    const { state, saveCreds } = useSingleFileAuthState(sessionFile);
    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false
    });

    sock.ev.on('creds.update', saveCreds);
    const pairCode = await sock.requestPairingCode(number);

    await db.read();
    db.data.sessions = db.data.sessions || [];
    db.data.sessions.push({ number, pairCode });
    await db.write();

    return res.json({ pairCode });
  } catch (err) {
    console.error('❌ Pairing error:', err);
    return res.status(500).json({ error: 'Failed to generate pair code' });
  }
});

// === Bot Logic ===
async function startBot() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) {
        console.log('⚠️ Reconnecting...');
        startBot();
      } else {
        console.log('🚫 Logged out');
      }
    } else if (connection === 'open') {
      console.log('✅ Connected to WhatsApp!');
    }
  });

  sock.ev.on('messages.upsert', async (m) => {
    if (!m.messages || !m.messages[0]) return;
    const msg = m.messages[0];
    if (msg.key.fromMe) return;

    try {
      const message = msg.message;
      let text = '';
      if (message.conversation) text = message.conversation;
      else if (message.extendedTextMessage?.text) text = message.extendedTextMessage.text;
      else if (message.imageMessage?.caption) text = message.imageMessage.caption;
      else return;

      if (!text.startsWith(PREFIX)) return;

      const args = text.slice(PREFIX.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();
      const chatId = msg.key.remoteJid;
      const sender = msg.key.participant || msg.key.remoteJid;
      const isOwner = sender && sender.includes(OWNER_NUMBER);

      const plugin = plugins.find(p => p.name === commandName);
      if (!plugin) return;

      if (plugin.ownerOnly && !isOwner) {
        await sock.sendMessage(chatId, { text: '❌ You are not allowed to use this command.' });
        return;
      }

      if (plugin.toggleable) {
        await db.read();
        const isEnabled = db.data.toggles?.[chatId]?.[plugin.name];
        if (!isEnabled) {
          await sock.sendMessage(chatId, { text: `🚫 *${plugin.name}* is OFF in this chat.` });
          return;
        }
      }

      await plugin.execute(sock, msg, args);
    } catch (error) {
      console.error('❌ Error handling message:', error);
    }
  });
}

// === Start Server ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Server is live on port ${PORT}`);
  startBot().catch(console.error);
});
