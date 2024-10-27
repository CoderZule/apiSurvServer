const Harvest = require('../models/harvest');
const Storage = require('../models/storage');



async function createHarvest(req, res) {
    try {
        const harvestData = req.body;

        const newHarvest = new Harvest({
            Product: harvestData.Product,
            Quantity: Number(harvestData.Quantity),  
            Unit: harvestData.Unit,
            Season: harvestData.Season,
            HarvestMethods: harvestData.HarvestMethods,
            QualityTestResults: harvestData.QualityTestResults,
            Date: harvestData.Date,
            Apiary: harvestData.Apiary,
            Hive: harvestData.Hive,
            User: harvestData.User,
            ApiaryRef: harvestData.ApiaryRef

        });

        await newHarvest.save();

        
        let storageEntry = await Storage.findOne({ Product: harvestData.Product, User: harvestData.User });

        if (!storageEntry) {
            storageEntry = new Storage({
                User: harvestData.User,
                Product: harvestData.Product,
                Quantities: [{
                    Total: Number(harvestData.Quantity),  
                    Unit: harvestData.Unit
                }]
            });
        } else {
            
            const quantityEntry = storageEntry.Quantities.find(q => q.Unit === harvestData.Unit);
            if (quantityEntry) {
                quantityEntry.Total += Number(harvestData.Quantity);  
            } else {
                storageEntry.Quantities.push({
                    Total: Number(harvestData.Quantity),  
                    Unit: harvestData.Unit
                });
            }
        }

       
        await storageEntry.save();

        return res.status(201).json({ message: 'Harvest entry created successfully', harvest: newHarvest });
    } catch (error) {
        console.error('Error creating harvest entry:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function fetchHarvests(req, res) {
    try {
        const userId = req.query.userId;

        const harvests = await Harvest.find({ User: userId });
        res.json({ success: true, data: harvests });
    } catch (error) {
        console.error('Error fetching harvests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function getHarvestById(req, res) {
    try {
        const { id } = req.params;
        const harvest = await Harvest.findById(id);

        if (!harvest) {
            return res.status(404).json({ message: 'Harvest entry not found' });
        }

        res.json(harvest);
    } catch (error) {
        console.error('Error getting harvest entry:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function editHarvest(req, res) {
    try {
        const editedHarvestData = req.body;
        const { _id } = editedHarvestData;

        const oldHarvest = await Harvest.findById(_id);
        if (!oldHarvest) {
            return res.status(404).json({ message: 'Harvest entry not found' });
        }

        const harvest = await Harvest.findByIdAndUpdate(_id, editedHarvestData, { new: true });
        if (!harvest) {
            return res.status(404).json({ message: 'Harvest entry not found' });
        }

        let storageEntry = await Storage.findOne({ Product: oldHarvest.Product });

        if (storageEntry) {
            const oldQuantity = Number(oldHarvest.Quantity); 
            const newQuantity = Number(editedHarvestData.Quantity);  

            const oldQuantityEntryIndex = storageEntry.Quantities.findIndex(q => q.Unit === oldHarvest.Unit);
            const newQuantityEntryIndex = storageEntry.Quantities.findIndex(q => q.Unit === editedHarvestData.Unit);

            if (oldQuantityEntryIndex !== -1) {
                storageEntry.Quantities[oldQuantityEntryIndex].Total -= oldQuantity;
                if (storageEntry.Quantities[oldQuantityEntryIndex].Total <= 0) {
                    storageEntry.Quantities.splice(oldQuantityEntryIndex, 1);
                }
            }

            if (newQuantityEntryIndex !== -1) {
                storageEntry.Quantities[newQuantityEntryIndex].Total += newQuantity;
            } else {
                storageEntry.Quantities.push({
                    Total: newQuantity,
                    Unit: editedHarvestData.Unit
                });
            }

            await storageEntry.save();
        }

        return res.status(200).json({ message: 'Harvest entry updated successfully', harvest });
    } catch (error) {
        console.error('Error updating harvest entry:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function deleteHarvest(req, res) {
    try {
        const { harvestId } = req.params;
        const deletedHarvest = await Harvest.findByIdAndDelete(harvestId);

        if (!deletedHarvest) {
            return res.status(404).json({ message: 'Harvest entry not found' });
        }

        let storageEntry = await Storage.findOne({ Product: deletedHarvest.Product });
        if (storageEntry) {
            const deletedQuantity = Number(deletedHarvest.Quantity);  
            console.log('Deleted Quantity:', deletedQuantity);  

            const unitIndex = storageEntry.Quantities.findIndex(q => q.Unit === deletedHarvest.Unit);
            if (unitIndex !== -1) {
                console.log('Before Update:', storageEntry.Quantities[unitIndex]);  
                storageEntry.Quantities[unitIndex].Total -= deletedQuantity;

                if (storageEntry.Quantities[unitIndex].Total <= 0) {
                    storageEntry.Quantities.splice(unitIndex, 1);
                }
                console.log('After Update:', storageEntry.Quantities[unitIndex]);  
            } else {
                console.log('Unit not found in storage:', deletedHarvest.Unit);
            }

            const savedStorageEntry = await storageEntry.save();
            console.log('Storage Entry Saved:', savedStorageEntry); 
        } else {
            console.log('No storage entry found for product:', deletedHarvest.Product);
        }

        return res.json({ message: 'Harvest entry deleted successfully' });
    } catch (error) {
        console.error('Error deleting harvest entry:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}



async function getTopRegions(req, res) {
    try {
        const { product } = req.query;

        if (!product) {
            return res.status(400).json({ message: 'Product is required' });
        }

         
        const topRegions = await Harvest.aggregate([
            {
                $match: { Product: product }
            },
            {
                $lookup: {
                    from: 'apiaries',
                    localField: 'ApiaryRef',
                    foreignField: '_id',
                    as: 'apiaryDetails'
                }
            },
            { $unwind: '$apiaryDetails' },
            {
                $group: {
                    _id: {
                        governorate: '$apiaryDetails.Location.governorate',
                        unit: '$Unit'
                    },
                    totalQuantity: { $sum: '$Quantity' }
                }
            },
            {
                $group: {
                    _id: '$_id.governorate',
                    quantitiesByUnit: {
                        $push: {
                            unit: '$_id.unit',
                            totalQuantity: '$totalQuantity'
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 1,
                    quantitiesByUnit: {
                        $arrayToObject: {
                            $map: {
                                input: '$quantitiesByUnit',
                                as: 'item',
                                in: {
                                    k: '$$item.unit',
                                    v: '$$item.totalQuantity'
                                }
                            }
                        }
                    }
                }
            },
            { $sort: { '_id': 1 } }, // Sort by governorate name
            { $limit: 5 } // Limit to top 5 regions
        ]);

        console.log('Top regions data:', topRegions);  

        
        if (topRegions.length === 0) {
            return res.status(404).json({ success: false, message: 'No regions found for the specified product.' });
        }

        
        const comparison = topRegions.map(region => ({
            governorate: region._id,
            quantitiesByUnit: region.quantitiesByUnit
        }));

        return res.status(200).json({ success: true, data: comparison });
    } catch (error) {
        console.error('Error fetching top regions:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}



module.exports = {
    fetchHarvests: fetchHarvests,
    createHarvest: createHarvest,
    getHarvestById: getHarvestById,
    editHarvest: editHarvest,
    deleteHarvest: deleteHarvest,
    getTopRegions: getTopRegions

};
