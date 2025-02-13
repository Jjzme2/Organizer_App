const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/db");
const logger = require("../utils/logger");
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
  expectedDifficulty: {
    type: DataTypes.ENUM('1', '2', '3', '4', '5', '6', '7', '8', '9', '10'),
    defaultValue: '5',
    allowNull: false,
    validate: {
      isIn: [['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']]
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const rawValue = this.getDataValue('notes');
      if (!rawValue) return [];
      try {
        return JSON.parse(rawValue);
      } catch (e) {
        return rawValue.split('|').map(note => note.trim());
      }
    },
    set(value) {
      if (Array.isArray(value)) {
        this.setDataValue('notes', JSON.stringify(value));
      } else if (typeof value === 'string') {
        // Handle single note addition
        const currentNotes = this.notes || [];
        currentNotes.push(value);
        this.setDataValue('notes', JSON.stringify(currentNotes));
      } else {
        this.setDataValue('notes', '[]');
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium',
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'archived'),
    defaultValue: 'pending',
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  userId: {
    type: DataTypes.UUID,
    field: 'userId',
    references: {
      model: 'users',
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
  },
  categoryId: {
    type: DataTypes.UUID,
    field: 'categoryId',
    references: {
      model: 'categories',
      key: 'id'
    }
  }
}, {
  tableName: 'tasks',
  freezeTableName: true,
  timestamps: true,
  indexes: [
    {
      name: 'idx_user_tasks',
      fields: ['userId']
    },
    {
      name: 'idx_task_status',
      fields: ['status']
    },
    {
      name: 'idx_task_due_date',
      fields: ['dueDate']
    }
  ],
  validate: {
    validateName() {
      if (this.name && (this.name.length < 3 || this.name.length > 255)) {
        throw new Error("Name must be between 3 and 255 characters long");
      }
    },
	// ! Due Dates should be able to be modified if the task is past due.
	// * Commented out 2/5/25
    // validateDueDate() {
    //   if (this.dueDate && new Date(this.dueDate) < new Date()) {
    //     throw new Error("Due date cannot be in the past");
    //   }
    // }
  }
});

// Instance Methods
Task.prototype.setActive = function(isActive) {
  this.isActive = isActive;
  return this.save();
};

Task.prototype.setComplete = function(isComplete) {
  this.isComplete = isComplete;
  if (isComplete) {
    this.completedAt = new Date();
  } else {
    this.completedAt = null;
  }
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
