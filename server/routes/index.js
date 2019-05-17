const express = require('express');
const router = express.Router();
const consoleErrorController = require('../controllers/consoleErrorController');
const siteController = require('../controllers/siteController');
const lighthouseController = require('../controllers/lighthouseController');

router.post('//add_site', (siteController.addSite));

router.post('//runAudits', (lighthouseController.runAudits));
router.post('//lighthouse', (lighthouseController.runLighthouseRequest));
router.post('//runAllSiteErrorAudits', (consoleErrorController.runConsoleAuditsOnAll)); 
router.post('//runSiteErrorAudits', (consoleErrorController.runConsoleAuditsOnSingleSite));

router.get('//siteList', (siteController.siteList));
router.get('//siteErrorAudits/:site', (consoleErrorController.getSiteErrorAudits));
router.get('//allSiteErrorAudits', (consoleErrorController.getAllSitesErrorAudits));

router.post('//removeSite', (siteController.removeSite));

router.post('//testPostForIntuit', (req, res) => {
    console.log("`GotRequest: ${JSON.stringify(req.body)}` ", `GotRequest: ${JSON.stringify(req.body)}`);
    setTimeout(function () {
        res.send({GotRequest: req.body});
    }, 3000);
})

module.exports = router;