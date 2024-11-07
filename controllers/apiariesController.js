const Apiary = require('../models/apiary');

const fetchApiaries = async (req, res) => {
    try {
         const Apiaries = await Apiary.find().populate('Owner');  

        res.json({ success: true, data: Apiaries });
    } catch (error) {
        console.error('Error fetching apiaries:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createApiary = async (req, res) => {
    try {
        const { Name, Forages, Type, Location, SunExposure, Owner } = req.body;

         if (!Name || !Forages || !Type || !Location || !SunExposure || !Owner) {
            return res.status(400).json({ error: 'Please provide all required fields' });
        }
         const newApiary = new Apiary({
            Name,
            Forages,
            Type,
            Location,
            SunExposure,
            Owner
        });

         await newApiary.save();

        res.status(201).json({ success: true, message: 'Apiary added successfully', data: newApiary });
    } catch (error) {
        console.error('Error adding apiary:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

async function getApiaryById(req, res) {
    try {
      const { id } = req.params; 
      const apiary = await Apiary.findById(id);
      
      if (!apiary) {
        return res.status(404).json({ message: 'Apiary not found' });
      }
      
      res.json(apiary);
    } catch (error) {
      console.error('Error getting apiary:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  
  
  async function editApiary(req, res) {
    try {
      const editedApiaryData = req.body; 
      const { _id } = editedApiaryData;
  
      const apiary = await Apiary.findByIdAndUpdate(_id, editedApiaryData, { new: true });
  
      if (!apiary) {
        return res.status(404).json({ message: 'Apiary not found' });
      }
      
      res.send("Apiary updated successfully");
    } catch (error) {
      console.error('Error updating apiary:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  
  
  async function deleteApiary(req, res) {
    try {
      const { apiaryId } = req.params; 
      const deletedApiary = await Apiary.findByIdAndDelete(apiaryId);
      
      if (!deletedApiary) {
        return res.status(404).json({ message: 'Apiary not found' });
      }
      
      res.send('Apiary deleted successfully');
    } catch (error) {
      console.error('Error deleting apiary:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

module.exports = {
    fetchApiaries: fetchApiaries,
    createApiary: createApiary,
    getApiaryById: getApiaryById,
    editApiary: editApiary,
    deleteApiary: deleteApiary

}