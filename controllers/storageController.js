const Storage = require('../models/storage');

const fetchStorage = async (req, res) => {
    try {
      const userId = req.query.userId;  
      const storageEntries = await Storage.find({ User: userId });

        return res.json({ success: true, data: storageEntries });
    } catch (error) {
        console.error('Error fetching storage entries:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

async function updateStorageQuantity(req, res) {
  try {
    const { product, unit, newQuantity } = req.body;

    if (!product || !unit || newQuantity === undefined) {
      return res.status(400).json({ success: false, message: 'Produit, unité et nouvelle quantité sont requis' });
    }

    const storageEntry = await Storage.findOne({ Product: product });

    if (!storageEntry) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }

    const quantityEntry = storageEntry.Quantities.find(q => q.Unit === unit);

    if (!quantityEntry) {
      return res.status(404).json({ success: false, message: `Unité ${unit} non trouvée pour le produit ${product}` });
    }

    
    if (newQuantity > quantityEntry.Total) {
      return res.status(400).json({ success: false, message: 'La quantité réduite ne peut pas être supérieure à la quantité actuelle' });
    }

   
    quantityEntry.Total -= newQuantity;
    storageEntry.updatedAt = Date.now();

    await storageEntry.save();

    res.status(200).json({ success: true, message: 'Quantité mise à jour avec succès' });
  } catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour de la quantité' });
  }
}

  

module.exports = {
    fetchStorage: fetchStorage,
    updateStorageQuantity:  updateStorageQuantity
};
