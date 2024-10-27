const Forage= require('../models/forage');


const fetchForages = async (req, res) => {
  try {
 
     const forages = await Forage.find();

    res.json({ success: true, data: forages });
  } catch (error) {
    console.error('Error fetching forages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

  
  const createForage = async (req, res) => {
    try {
      const { Name} = req.body;
   
  
      const newForage = new Forage({
        Name
      });
  
      await newForage.save();
  
      res.status(201).json({ success: true, message: 'Forage added successfully', data: newForage });
    } catch (error) {
      console.error('Error adding forage:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  async function getForageById(req, res) {
    try {
      const { id } = req.params;
      const forage = await Forage.findById(id);
  
      if (!forage) {
        return res.status(404).json({ message: 'Forage not found' });
      }
  
      res.json(forage);
    } catch (error) {
      console.error('Error getting forage:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  async function editForage(req, res) {
    try {
      const editedForageData = req.body;
      const { _id } = editedForageData;
  
      const forage= await Forage.findByIdAndUpdate(_id, editedForageData, { new: true });
  
      if (!forage) {
        return res.status(404).json({ message: 'Forage not found' });
      }
  
      res.send("Forage updated successfully");
    } catch (error) {
      console.error('Error updating forage:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
async function deleteForage(req, res) {
    try {
      const { forageId } = req.body;
      const deletedForage= await Forage.findByIdAndDelete(forageId);
  
      if (!deletedForage) {
        return res.status(404).json({ message: 'Forage not found' });
      }
  
      res.status(200).json({ message: 'Forage deleted successfully' });
    } catch (error) {
      console.error('Error deleting forage:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  
  module.exports = {
    fetchForages: fetchForages,
    createForage: createForage,
    getForageById: getForageById,
    editForage: editForage,
    deleteForage: deleteForage
  };
  