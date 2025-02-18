const logger = require("./logger");
const { AuthenticationError, NotFoundError, AppError } = require("./errorUtils");

class BaseController {
  constructor(model, name) {
    this.model = model;
    this.name = name;
    this.logger = logger;
  }

  // Get all items for the current user
  getAll = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AuthenticationError();
      }

      const items = await this.model.findAll({
        where: { userId: req.user.id },
        order: [['createdAt', 'DESC']]
      });

      res.json(items);
    } catch (error) {
      this.logger.error(`Error in getAll ${this.name}:`, error);
      throw new AppError(`Failed to get ${this.name}s`, 500, `${this.name.toUpperCase()}_FETCH_ERROR`);
    }
  };

  // Get item by ID for the current user
  getById = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AuthenticationError();
      }

      const item = await this.model.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });

      if (!item) {
        throw new NotFoundError(`${this.name} not found`);
      }

      res.json(item);
    } catch (error) {
      this.logger.error(`Error in getById ${this.name}:`, error);
      throw new AppError(`Failed to get ${this.name}`, 500, `${this.name.toUpperCase()}_FETCH_ERROR`);
    }
  };

  // Create a new item for the current user
  create = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AuthenticationError();
      }

      const item = await this.model.create({
        ...req.body,
        userId: req.user.id
      });

      res.status(201).json(item);
    } catch (error) {
      this.logger.error(`Error in create ${this.name}:`, error);
      throw new AppError(`Failed to create ${this.name}`, 500, `${this.name.toUpperCase()}_CREATE_ERROR`);
    }
  };

  // Update an item by ID for the current user
  update = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AuthenticationError();
      }

      const item = await this.model.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });

      if (!item) {
        throw new NotFoundError(`${this.name} not found`);
      }

      await item.update(req.body);
      res.json(item);
    } catch (error) {
      this.logger.error(`Error in update ${this.name}:`, error);
      throw new AppError(`Failed to update ${this.name}`, 500, `${this.name.toUpperCase()}_UPDATE_ERROR`);
    }
  };

  // Delete an item by ID for the current user
  delete = async (req, res) => {
    try {
      if (!req.user || !req.user.id) {
        throw new AuthenticationError();
      }

      const item = await this.model.findOne({
        where: {
          id: req.params.id,
          userId: req.user.id
        }
      });

      if (!item) {
        throw new NotFoundError(`${this.name} not found`);
      }

      await item.destroy();
      res.status(204).send();
    } catch (error) {
      this.logger.error(`Error in delete ${this.name}:`, error);
      throw new AppError(`Failed to delete ${this.name}`, 500, `${this.name.toUpperCase()}_DELETE_ERROR`);
    }
  };
}

module.exports = BaseController;
