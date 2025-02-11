const Jotting = require("../models/Jotting");
const logger = require("../utils/logger");
const { AuthenticationError, NotFoundError, AppError } = require("../utils/errorUtils");

exports.getAllJottings = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const jottings = await Jotting.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.json(jottings);
  } catch (error) {
    logger.error('Error in getAllJottings:', error);
    throw new AppError("Failed to get jottings", 500, "JOTTING_FETCH_ERROR");
  }
};

exports.getJottingById = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const jotting = await Jotting.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!jotting) {
      throw new NotFoundError("Jotting not found");
    }

    res.json(jotting);
  } catch (error) {
    logger.error('Error in getJottingById:', error);
    throw new AppError("Failed to get jotting", 500, "JOTTING_FETCH_ERROR");
  }
};

exports.createJotting = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const jotting = await Jotting.create({
      ...req.body,
      userId: req.user.id
    });

    res.status(201).json(jotting);
  } catch (error) {
    logger.error('Error in createJotting:', error);
    throw new AppError("Failed to create jotting", 500, "JOTTING_CREATE_ERROR");
  }
};

exports.updateJotting = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const jotting = await Jotting.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!jotting) {
      throw new NotFoundError("Jotting not found");
    }

    await jotting.update(req.body);
    res.json(jotting);
  } catch (error) {
    logger.error('Error in updateJotting:', error);
    throw new AppError("Failed to update jotting", 500, "JOTTING_UPDATE_ERROR");
  }
};

exports.deleteJotting = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      throw new AuthenticationError();
    }

    const jotting = await Jotting.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!jotting) {
      throw new NotFoundError("Jotting not found");
    }

    await jotting.destroy();
    res.json({ message: "Jotting deleted successfully" });
  } catch (error) {
    logger.error('Error in deleteJotting:', error);
    throw new AppError("Failed to delete jotting", 500, "JOTTING_DELETE_ERROR");
  }
};