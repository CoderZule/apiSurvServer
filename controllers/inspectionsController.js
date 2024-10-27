const Inspection = require('../models/inspection');
const HiveModel = require('../models/hive');


const fetchInspections = async (req, res) => {
    try {
        const inspections = await Inspection.find().populate('Hive');
        res.json({ success: true, data: inspections });
    } catch (error) {
        console.error('Error fetching inspections:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const createInspection = async (req, res) => {
    try {
        const {
            Inspector, InspectionDateTime, Queen, Colony, Brood,
            DronesSeen, Supplies, BeeHealth, HoneyStores,
            PollenStores, Adding, Removing, Weather, Note, Hive
        } = req.body;

         
        const data = {
            Inspector,
            InspectionDateTime,
            Colony,
            Brood,
            DronesSeen,
            Supplies,
            BeeHealth,
            HoneyStores,
            PollenStores,
            Adding,
            Removing,
            Weather,
            Note,
            Hive
        };

        
        if (Queen) {
            data.Queen = Queen;
        }

        
        const filteredData = removeEmptyFields(data);

        const newInspection = new Inspection(filteredData);

        await newInspection.save();

         
        if (Queen) {
            const updatedHiveData = {
                'Queen.seen': Queen.seen,
                'Queen.isMarked': Queen.isMarked,
                'Queen.color': Queen.color,
                'Queen.clipped': Queen.clipped,
                'Queen.temperament': Queen.temperament,
                'Queen.note': Queen.note,
                'Queen.queenCells': Queen.queenCells,
                'Queen.isSwarmed': Queen.isSwarmed,
                'Colony.strength': Colony.strength,
                'Colony.temperament': Colony.temperament,
                'Colony.deadBees': Colony.deadBees,
                'Colony.supers': Colony.supers,
                'Colony.pollenFrames': Colony.pollenFrames,
                'Colony.TotalFrames': Colony.TotalFrames,
                'Colony.note': Colony.note
            };



            await HiveModel.findByIdAndUpdate(Hive, { $set: updatedHiveData }, { new: true });
        } else {
            const updatedHiveData = {

                'Colony.strength': Colony.strength,
                'Colony.temperament': Colony.temperament,
                'Colony.deadBees': Colony.deadBees,
                'Colony.supers': Colony.supers,
                'Colony.pollenFrames': Colony.pollenFrames,
                'Colony.TotalFrames': Colony.TotalFrames,
                'Colony.note': Colony.note
            };

            await HiveModel.findByIdAndUpdate(Hive, { $set: updatedHiveData }, { new: true });

        }

        res.status(201).json({ success: true, message: 'Inspection ajoutée avec succès', data: newInspection });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'inspection :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
};


const removeEmptyFields = (obj) => {
    const newObj = {};
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            const nestedObj = removeEmptyFields(obj[key]);
            if (Object.keys(nestedObj).length > 0) {
                newObj[key] = nestedObj;
            }
        } else if (obj[key] !== '' && obj[key] !== null && obj[key] !== undefined && obj[key] !== 0) {
            newObj[key] = obj[key];
        }
    });
    return newObj;
};



async function getInspectionByHiveId(req, res) {
    try {
        const { id } = req.params;
        const inspections = await Inspection.find({ Hive: id });
        if (!inspections || inspections.length === 0) {
            return res.status(404).json({ message: 'Inspections not found' });
        }

        res.json(inspections);
    } catch (error) {
        console.error('Error getting inspections:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
async function editInspection(req, res) {
    try {
        const editedInspectionData = req.body;
        const { _id, Queen, Colony, Hive } = editedInspectionData;

        const inspection = await Inspection.findByIdAndUpdate(_id, editedInspectionData, { new: true });

        if (!inspection) {
            return res.status(404).json({ message: 'Inspection not found' });
        }

         
        if (Queen) {
            const updatedHiveData = {
                'Queen.seen': Queen.seen,
                'Queen.isMarked': Queen.isMarked,
                'Queen.color': Queen.color,
                'Queen.clipped': Queen.clipped,
                'Queen.temperament': Queen.temperament,
                'Queen.note': Queen.note,
                'Queen.queenCells': Queen.queenCells,
                'Queen.isSwarmed': Queen.isSwarmed,
                'Colony.strength': Colony.strength,
                'Colony.temperament': Colony.temperament,
                'Colony.deadBees': Colony.deadBees,
                'Colony.supers': Colony.supers,
                'Colony.pollenFrames': Colony.pollenFrames,
                'Colony.TotalFrames': Colony.TotalFrames,
                'Colony.note': Colony.note
            };

            await HiveModel.findByIdAndUpdate(Hive, { $set: updatedHiveData }, { new: true });
        } else {
            const updatedHiveData = {
                'Colony.strength': Colony.strength,
                'Colony.temperament': Colony.temperament,
                'Colony.deadBees': Colony.deadBees,
                'Colony.supers': Colony.supers,
                'Colony.pollenFrames': Colony.pollenFrames,
                'Colony.TotalFrames': Colony.TotalFrames,
                'Colony.note': Colony.note
            };

            await HiveModel.findByIdAndUpdate(Hive, { $set: updatedHiveData }, { new: true });
        }

        res.json({ success: true, message: 'Inspection mise à jour avec succès', data: inspection });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'inspection :', error);
        return res.status(500).json({ message: 'Erreur interne du serveur' });
    }
}



async function deleteInspection(req, res) {
    try {
        const { inspectionId } = req.body;
        const deletedInspection = await Inspection.findByIdAndDelete(inspectionId);

        if (!deletedInspection) {
            return res.status(404).json({ message: 'Inspection not found' });
        }

        res.send('Inspection deleted successfully');
    } catch (error) {
        console.error('Error deleting inspection:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

const fetchInspectionsWithDiseases = async (req, res) => {
    try {
        const inspections = await Inspection.find({ 'BeeHealth.disease': { $exists: true, $ne: '' } })
            .populate({
                path: 'Hive',
                populate: {
                    path: 'Apiary',  
                }
            });

        if (!inspections || inspections.length === 0) {
            return res.status(404).json({ success: false, message: 'No inspections with diseases found' });
        }

        res.json({ success: true, data: inspections });
    } catch (error) {
        console.error('Error fetching inspections with diseases:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




module.exports = {
    fetchInspections: fetchInspections,
    createInspection: createInspection,
    getInspectionByHiveId: getInspectionByHiveId,
    editInspection: editInspection,
    deleteInspection: deleteInspection,
    fetchInspectionsWithDiseases: fetchInspectionsWithDiseases
}
