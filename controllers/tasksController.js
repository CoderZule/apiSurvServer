const Task = require('../models/task');


const fetchTasks = async (req, res) => {
  try {
    const userId = req.query.userId;  

     const tasks = await Task.find({ user: userId });

    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

  
  const createTask = async (req, res) => {
    try {
      const { title,priority, description, start, end , user} = req.body;
  
      console.log('Received data:', { title, priority, description, start, end , user});
  
      if (!title || !priority || !description || !start || !end || !user) {
        return res.status(400).json({ error: 'Please provide all required fields' });
      }
  
      const newTask = new Task({
        title,
        priority,
        description,
        start: new Date(start),  
        end: new Date(end),  
        user
      });
  
      await newTask.save();
  
      res.status(201).json({ success: true, message: 'Task added successfully', data: newTask });
    } catch (error) {
      console.error('Error adding task:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  async function getTaskById(req, res) {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.json(task);
    } catch (error) {
      console.error('Error getting task:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  async function editTask(req, res) {
    try {
      const editedTaskData = req.body;
      const { _id } = editedTaskData;
  
      const task = await Task.findByIdAndUpdate(_id, editedTaskData, { new: true });
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.send("Task updated successfully");
    } catch (error) {
      console.error('Error updating task:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
async function deleteTask(req, res) {
    try {
      const { taskId } = req.body;
      const deletedTask = await Task.findByIdAndDelete(taskId);
  
      if (!deletedTask) {
        return res.status(404).json({ message: 'Task not found' });
      }
  
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  
  module.exports = {
    fetchTasks: fetchTasks,
    createTask: createTask,
    getTaskById: getTaskById,
    editTask: editTask,
    deleteTask: deleteTask
  };
  