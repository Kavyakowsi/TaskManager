const Task = require('../models/Task');

// Get all tasks for logged-in user (with filters)
exports.getTasks = async (req, res) => {
  try {
    const { search, priority, stage } = req.query;
    
    // Base query filters tasks by the authenticated user's ID
    const query = { userId: req.userId };
    
    // Add text search filter if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Add priority filter if provided
    if (priority) {
      query.priority = priority;
    }

    // Add stage filter if provided
    if (stage) {
      query.stage = stage;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.error(`GetTasks Error: ${error.message}`);
    res.status(500).json({ message: 'Server error retrieving tasks' });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, stage, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Task title is required' });
    }

    const task = await Task.create({
      userId: req.userId,
      title,
      description,
      stage: stage || 'Todo',
      priority: priority || 'Medium',
      dueDate: dueDate || null
    });

    res.status(201).json(task);
  } catch (error) {
    console.error(`CreateTask Error: ${error.message}`);
    res.status(500).json({ message: 'Server error creating task' });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, stage, priority, dueDate } = req.body;

    // Find task
    let task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check task ownership
    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    // Update fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (stage !== undefined) task.stage = stage;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();
    res.json(task);
  } catch (error) {
    console.error(`UpdateTask Error: ${error.message}`);
    res.status(500).json({ message: 'Server error updating task' });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Find task
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check task ownership
    if (task.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error(`DeleteTask Error: ${error.message}`);
    res.status(500).json({ message: 'Server error deleting task' });
  }
};
