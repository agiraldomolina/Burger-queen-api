/*eslint-disable*/
const express = require('express');
const viewsController = require('../controllers/viewController');

const router = express.Router();

// router.get('/', (req, res) => {
//   res.status(200).render('base', {
//     tour: 'The Forest Hiker',
//     user: 'Jonas',
//   });
// });

router.get('/', viewsController.getOverview);

router.get('/menu', viewsController.getMenu);

module.exports = router;