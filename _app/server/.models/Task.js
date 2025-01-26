const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const logger = require("../utils/logger");
const User = require("./User");

const Task = sequelize.define("Task", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  isComplete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('notes');
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(value) {
      this.setDataValue('notes', JSON.stringify(value || []));
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  userId: {
    type: DataTypes.UUID,
    references: {
      model: User,
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  validate: {
    validateName() {
      if (this.name && (this.name.length < 3 || this.name.length > 255)) {
        throw new Error("Name must be between 3 and 255 characters long");
      }
    },
    validateDueDate() {
      if (this.dueDate && new Date(this.dueDate) < new Date()) {
        throw new Error("Due date cannot be in the past");
      }
    }
  }
});

// Associations
Task.belongsTo(User, { foreignKey: 'userId' });

// Instance Methods
Task.prototype.setActive = function(isActive) {
  this.isActive = isActive;
  return this.save();
};

Task.prototype.setComplete = function(isComplete) {
  this.isComplete = isComplete;
  return this.save();
};

Task.prototype.addNote = function(note) {
  const notes = this.notes || [];
  notes.push(note);
  this.notes = notes;
  return this.save();
};

Task.prototype.removeNote = function(noteIndex) {
  const notes = this.notes || [];
  if (noteIndex >= 0 && noteIndex < notes.length) {
    notes.splice(noteIndex, 1);
    this.notes = notes;
    return this.save();
  }
  throw new Error("Invalid note index");
};

Task.prototype.updateNote = function(noteIndex, newNote) {
  const notes = this.notes || [];
  if (noteIndex >= 0 && noteIndex < notes.length) {
    notes[noteIndex] = newNote;
    this.notes = notes;
    return this.save();
  }
  throw new Error("Invalid note index");
};

module.exports = Task;
