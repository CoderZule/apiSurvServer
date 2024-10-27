const Hive = require('../models/hive');

const fetchHives = async (req, res) => {
  try {
    const Hives = await Hive.find().populate('Apiary');

    res.json({ success: true, data: Hives });
  } catch (error) {
    console.error('Error fetching hives:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createHive = async (req, res) => {
  try {
    const { Name, Color, Type, Source, Purpose, Added, Colony, Queen, Apiary } = req.body;

     const hiveData = {
      Name,
      Color,
      Type,
      Source,
      Purpose,
      Added,
      Colony,
      Apiary,
    };

    if (Queen && Queen.race) {
      hiveData.Queen = Queen;
    }

    const newHive = new Hive(hiveData);

    await newHive.save();

    res.status(201).json({ success: true, message: 'Hive added successfully', data: newHive });
  } catch (error) {
    console.error('Error adding hive:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

async function getHiveById(req, res) {
  try {
    const { id } = req.params;
    const hive = await Hive.findById(id).populate('Apiary').populate({ path: 'Apiary', populate: { path: 'Owner' } });

    if (!hive) {
      return res.status(404).json({ message: 'Hive not found' });
    }

    res.json(hive);
  } catch (error) {
    console.error('Error getting hive:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}



async function editHive(req, res) {
  try {
    const editedHiveData = req.body;
    const { _id } = editedHiveData;


    const hive = await Hive.findByIdAndUpdate(_id, editedHiveData, { new: true });
    

    if (!hive) {
      return res.status(404).json({ message: 'Hive not found' });
    }

    res.send("Hive updated successfully");
  } catch (error) {
    console.error('Error updating hive:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


async function deleteHive(req, res) {
  try {
    const { hiveid } = req.body;
    const deletedHive = await Hive.findByIdAndDelete(hiveid);

    if (!deletedHive) {
      return res.status(404).json({ message: 'Hive not found' });
    }

    res.send('Hive deleted successfully');
  } catch (error) {
    console.error('Error deleting hive:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function fetchHivesByApiary(req, res) {
  try {
    const { apiaryId } = req.query;
    const hives = await Hive.find({ Apiary: apiaryId }).populate('Apiary');

    if (!hives.length) {
      return res.json({ success: true, data: [] });
    }


    res.json({ success: true, data: hives });
  } catch (error) {
    console.error('Error fetching hives by apiary:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


module.exports = {
  fetchHives: fetchHives,
  fetchHivesByApiary: fetchHivesByApiary,
  createHive: createHive,
  getHiveById: getHiveById,
  editHive: editHive,
  deleteHive: deleteHive

}