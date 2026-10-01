const express = require('express');
const router = express.Router();
const { Collection, Product } = require('../models');
const { protect } = require('../middleware/auth');

// Get all collections (public)
router.get('/', async (req, res) => {
  try {
    const collections = await Collection.findAll();
    res.json(collections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create collection
router.post('/', protect, async (req, res) => {
  try {
    const { name, description, products } = req.body;
    const collection = await Collection.create({
      name,
      description,
      products: JSON.stringify(products || []),
      creatorId: req.user.id,
      affiliateCode: 'C-' + Math.random().toString(36).substring(2, 8).toUpperCase()
    });
    res.status(201).json(collection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific collection by ID
router.get('/:id', async (req, res) => {
  try {
    const collection = await Collection.findByPk(req.params.id);
    if (!collection) return res.status(404).json({ message: 'Collection not found' });
    
    // update views
    collection.views += 1;
    await collection.save();

    res.json(collection);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
