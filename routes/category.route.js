const express = require('express');
const router = express.Router();

const categoryModel = require('../models/category.model');

router.get('/', async (req, res) => {
    const categories = await categoryModel.findAll();
    return res.status(200).json(categories);
});

module.exports = router;