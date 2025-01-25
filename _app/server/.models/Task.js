const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

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
  },
  isComplete: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  dueDate: {
    type: DataTypes.DATE,
  },
  notes: {
    type: DataTypes.ARRAY(DataTypes.TEXT),
    defaultValue: "",
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  userId : {
    type: DataTypes.UUID,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
  },

  {
    validate: {
      validateName() {
        if (this.name.length < 3 || this.name.length > 255)
          throw new Error("Name must be between 3 and 255 characters long");
        
        let regex = /[!@#$%^&*(),.?":{}|<>]/g;
        if (this.name.contains(regex)) 
          throw new Error("Name must not contain special characters");
      },

      validateDescription() {
        if (this.description.length < 10 || this.description.length > 1000)
          throw new Error(
            "Description must be between 10 and 1000 characters long"
          );
      },

      validateDueDate() {
        if (this.dueDate < new Date())
          throw new Error("Due date must be in the future");
      },
    },
  }
);

// Instance Method
Task.prototype.setActive = function (isActive) {
  this.isActive = isActive;
  return this.save();
};

Task.prototype.setComplete = function (isComplete) {
  this.isComplete = isComplete;
  return this.save();
};

Task.prototype.addNote = function (note) {
  this.notes.push(note);
  return this.save();
}

Task.prototype.removeNote = function (note) {
  this.notes = this.notes.filter(n => n !== note);
  return this.save();
}

Task.prototype.updateNote = function (oldNote, newNote) {
  this.notes = this.notes.map(n => n === oldNote ? newNote : n);
  return this.save();
}

Task.prototype.update = function (data) {
  Object.keys(data).forEach(key => {
    this[key] = data[key];
  });
  return this.save();
}


module.exports = Task;
