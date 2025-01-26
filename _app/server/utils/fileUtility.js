const fs = require("fs");
const util = require("util");
const logger = require("../utils/logger");

// Promisify fs methods for easier async/await usage
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const fileUtility = {
  /**
   * Reads a file and returns its contents as a string.
   * @param {string} filePath - The path to the file.
   * @param {string} encoding - The file encoding (e.g., 'utf8').
   * @returns {Promise<string>} - A promise that resolves with the file contents.
   */
  async readFile(filePath, encoding = "utf8") {
    try {
      const data = await readFile(filePath, encoding);
      return data;
    } catch (error) {
      logger.error(`Error reading file ${filePath}:`, error);
      throw error; // Re-throw the error for handling by the caller
    }
  },

  /**
   * Writes data to a file.
   * @param {string} filePath - The path to the file.
   * @param {string} data - The data to write to the file.
   * @param {string} encoding - The file encoding (e.g., 'utf8').
   * @returns {Promise<void>} - A promise that resolves when the file is written.
   */
  async writeFile(filePath, data, encoding = "utf8") {
    try {
      await writeFile(filePath, data, encoding);
    } catch (error) {
      logger.error(`Error writing to file ${filePath}:`, error);
      throw error;
    }
  },

  async appendToFile(filePath, data, encoding = "utf8") {
    try {
      await fs.promises.appendFile(filePath, data, encoding);
    } catch (error) {
      logger.error(`Error appending to file ${filePath}:`, error);
      throw error;
    }
  },

  async deleteFile(filePath) {
    try {
      await fs.promises.unlink(filePath);
    }
    catch (error) {
      logger.error(`Error deleting file ${filePath}:`, error);
      throw error;
    }
  },

  async fileExists(filePath) {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch (error) {
      return false;
    }
  },

  async createDirectory(dirPath) {
    try {
      await fs.promises.mkdir(dirPath, { recursive: true });
    } catch (error) {
      logger.error(`Error creating directory ${dirPath}:`, error);
      throw error;
    }
  },

  async deleteDirectory(dirPath) {
    try {
      await fs.promises.rmdir(dirPath, { recursive: true });
    }
    catch (error) {
      logger.error(`Error deleting directory ${dirPath}:`, error);
      throw error;
    }
  },
};

module.exports = fileUtility;
