/*
 * All routes for items are defined here
 * Since this file is loaded in server.js into api/items,
 *   these routes are mounted onto /api/items
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const getCatId = require('./helperFunctions/fetchCategory.js');
const dataHelpers = require('./data-helpers.js');

// get all items
router.get("/", (req, res) => {
  dataHelpers
    .getAllItems(req.query)
    .then(items => {
      res.json(items);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

// Get list by category
router.get('/:category', (req, res) => {
  const category = req.params.category;
  const categories = {
    watch: 1,
    read: 2,
    eat: 3,
    buy: 4
  };
  const categoryId = categories[category];
  if (categoryId === undefined) {
    res.status(400);
  } else {
    dataHelpers
      .getListByCategory(categoryId)
      .then(items => {
        res.json(items);
      })
      .catch((err) => {
        res.send(err);
      });
  }
});

// Add new item ** need to add an event listener **
router.post('/', (req, res) => {
  if (!req.body.text) {
    res.status(400).json({error: 'invalid request: no data in POST body'});
    return;
  }
  const item = req.body.text;

  const category = getCatId(item);
  const categories = {
    "To Watch": 1,
    "To Read": 2,
    "To Eat": 3,
    "To Buy": 4
  };
  const categoryId = categories[category];
  dataHelpers
    .addNewItem(categoryId, item)
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.send(err);
    });
});

module.exports = router;

/*

// Add new item to list and category

// Edit an item
router.post('/:id', (req, res) => {
  const itemId = req.params.id;

});

//Delete an item
router.post('/:id/delete', (req, res) => {
  const itemId = req.params.id;

});

return router;

*/
