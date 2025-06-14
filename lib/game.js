//══════════════════════════════════════════════════════════════════════════════════════════════════════//
//                                                                                                      //
//                                    𝗗𝗔𝗩𝗘-𝗠𝗗-𝗩𝟭 𝐁𝐎𝐓                                                  //
//                                                                                                      //
//                                         Ｖ：1.0                                                       //
//                                                                                                      //      
//               ██╗  ██╗██╗     ██╗ ██████╗ ██████╗ ███╗   ██╗      ██╗   ██╗██╗  ██╗                  //              
//                ██╗██╔╝██║     ██║██╔════╝██╔═══██╗████╗  ██║      ██║   ██║██║  ██║                  //
//                ╚███╔╝ ██║     ██║██║     ██║   ██║██╔██╗ ██║█████╗██║   ██║███████║                  // 
//                ██╔██╗ ██║     ██║██║     ██║   ██║██║╚██╗██║╚════╝╚██╗ ██╔╝╚════██║                  // 
//               ██╔╝ ██╗███████╗██║╚██████╗╚██████╔╝██║ ╚████║       ╚████╔╝      ██║                  //
//                ═╝  ╚═╝╚══════╝╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝        ╚═══╝       ╚═╝                  // 
//                                                                                                      //
//   © 2025 Dave-Md-V1                                                                                  //
//   Developed by Gifted Dave | WhatsApp: https://wa.me/254104260236                                   //
//   GitHub: https://github.com/gifteddaves | Telegram: https://t.me/Digladoo                           //
//══════════════════════════════════════════════════════════════════════════════════════════════════════//

require('../settings');
const { sleep, clockString } = require('./function');

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())];
}

// All core game functions below — unchanged logic
const gameSlot = async (conn, m, db) => {
  // ...
};

const gameCasinoSolo = async (conn, m, prefix, db) => {
  // ...
};

const gameMerampok = async (m, db) => {
  // ...
};

const gameTangkapOr = async (conn, m, db) => {
  // ...
};

const daily = async (conn, m, db) => {
  // ...
};

const transferLimit = async (conn, m, args, db) => {
  // ...
};

const transferUang = async (conn, m, args, db) => {
  // ...
};

const buy = async (m, args, db) => {
  // ...
};

const setLimit = (m, db) => db.users[m.sender].limit -= 1;
const setUang = (m, db) => db.users[m.sender].uang -= 1000;

module.exports = {
  gameSlot,
  gameCasinoSolo,
  gameMerampok,
  gameTangkapOr,
  daily,
  transferLimit,
  transferUang,
  buy,
  setLimit,
  setUang
};