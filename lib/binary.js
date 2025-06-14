//══════════════════════════════════════════════════════════════════════════════════════════════════════//
//                                                                                                      //
//                                    𝗗𝗔𝗩𝗘-𝗠𝗗-𝗩𝟭  𝐁𝐎𝐓                                                //
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
//                                                                                                      //
//                                                                                                      //
//══════════════════════════════════════════════════════════════════════════════════════════════════════//
//*
//  * @project_name : Dave-Md-V1
//  * @author : Gifted Dave
//  * @gmail : comradeanasafa@gmail.com
//  * @description : Dave-Md-V1, A Multi-functional WhatsApp user bot.
//*
//*
//base by Gifted Dave
//re-upload? recode? copy code? give credit ya :)
//Instagram: https://www.instagram.com/_gifted_dave
//Telegram: https://t.me/Digladoo
//GitHub: https://github.com/gifteddaves
//WhatsApp: https://wa.me/254104260236
//want more free bot scripts? join my WhatsApp group: https://chat.whatsapp.com/CaPeB0sVRTrL3aG6asYeAC
//   * Created By GitHub: gifteddaves
//   * Credit To Gifted Dave
//   * © 2025 Dave-Md-V1.
// ⛥┌┤
// */

async function dBinary(str) {
  var newBin = str.split(" ")
  var binCode = []
  for (i = 0; i < newBin.length; i++) {
      binCode.push(String.fromCharCode(parseInt(newBin[i], 2)))
  }
  return binCode.join("")
}

async function eBinary(str = '') {    
  let res = ''
  res = str.split('').map(char => {       
    return char.charCodeAt(0).toString(2);  
  }).join(' ')
  return res
}

module.exports = { dBinary, eBinary }