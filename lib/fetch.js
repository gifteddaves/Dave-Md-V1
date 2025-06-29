const fetch = require('node-fetch');
const chalk = require('chalk');

// Default API URL (you can change this)
global.api = 'https://api.maher-zubair.xyz/';
global.id = '30ad0d748059aee58dd';

/**
 * Fetch and return JSON from a URL
 * @param {string} url - The API URL
 * @param {object} options - Optional fetch options (headers, etc.)
 * @returns {Promise<object>}
 */
const fetchJson = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(chalk.red(`[❌ fetchJson ERROR] ${err}`));
    return { status: false, error: err.message };
  }
};

/**
 * Fetch and return plain text from a URL
 * @param {string} url - The API URL
 * @param {object} options - Optional fetch options
 * @returns {Promise<string>}
 */
const fetchText = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    return await res.text();
  } catch (err) {
    console.error(chalk.red(`[❌ fetchText ERROR] ${err}`));
    return '';
  }
};

module.exports = { fetchJson, fetchText };
