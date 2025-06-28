const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const bodyParser = require("body-parser");
const { Boom } = require('@hapi/boom');
require('events').EventEmitter.defaultMaxListeners = 500;

// 📲 Baileys setup
const {
  default: makeWASocket,
  useSingleFileAuthState,
  DisconnectReason
} = require('@whiskeysockets/baileys');

// 🔐 Session Auth
const sessionPath = path.join(__dirname, 'session');
if (!fs.existsSync(sessionPath)) fs.mkdirSync(sessionPath);
const sessionFile = path.join(sessionPath, 'creds.json');
const { state, saveState } = useSingleFileAuthState(sessionFile);

// 🌍 Global Configs & Bot Logic
require('./settings');
require('./Dave-Md-V1.js'); // Bot logic file

// 🤖 Start Bot
async function startBot() {
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
  });

  sock.ev.on('creds.update', saveState);

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
      console.log('❌ Disconnected. Reason:', reason);
      if (reason !== DisconnectReason.loggedOut) startBot();
    } else if (connection === 'open') {
      console.log('✅ Dave-Md-V1 connected to WhatsApp.');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    const m = messages[0];
    if (!m?.message || m.key.fromMe) return;
    const sender = m.key.remoteJid;
    const text = m.message?.conversation || m.message?.extendedTextMessage?.text;
    if (text?.toLowerCase() === 'hi' || text?.toLowerCase() === 'hello') {
      await sock.sendMessage(sender, { text: '👋 Hello! Dave-Md-V1 is online and working.' });
    }
  });
}
startBot();

// 🌐 Express Setup
const PORT = process.env.PORT || 8000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// 🔁 Routes
try {
  const pairHandler = require('./pair');
  const qrHandler = require('./qr');
  app.use('/pair', pairHandler);
  app.use('/qr', qrHandler);
} catch (e) {
  console.warn('⚠️ Optional API routes not found or skipped.');
}

// 🖼️ Static Page Routes
app.get('/pair', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pair.html'));
});

app.get('/', (_, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Health Check
app.get('/health', (_, res) => {
  res.send('🟢 Dave-Md-V1 backend running');
});

// 🚀 Server Listen
app.listen(PORT, () => {
  console.log(`🌍 Server running on http://localhost:${PORT}`);
});

module.exports = app;
