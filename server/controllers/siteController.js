const mongoose = require('mongoose');
const Site = mongoose.model('Site');
const utils = require ('../utils/utils');
const moment = require ('moment');

exports.addSite = async (req, res) => {
    let siteName = req.body.siteName.toLowerCase();
    Site.findOne({'siteName': siteName}, async (err, foundItem) => {
        if (foundItem) {
            res.send({'error': 'Sorry that site already exists in the database!'});
            return;
        } else {
            req.body.siteName = req.body.siteName.toLowerCase();
            let time = moment.utc();
            const site = new Site({...req.body, created: time});
            await site.save((err, savingResponse) => {
                if (err) {
                    console.log(err);
                    res.send(`Sorry couldn't add to the database, error message: ${err}`);
                    return;
                }
                console.log(`Saved ${siteName} to the database!`);
            })
            res.send({'Saved the to the database!': `Make sure to send a post to /runSiteErrorAudits with {"siteName": ${siteName}} to run the first console error check!`});
        };
    })
}

exports.siteList = (req, res) => {
    Site.find({}, async (err, sites) => {
        let response = [];
        sites.forEach(site => {
            response.push(site.siteName);
        });
        res.send({'SiteList': response});
    });
}

exports.removeSite = (req, res) => {
    let siteName = req.body.siteName.toLowerCase();
    Site.deleteOne({'siteName':site}, async (err) => {
        if (err) {
            res.send({'error': 'Sorry that site isn\'t in the database!'});
        } else {
            res.send({'Complete': `Removed ${siteName} from the database!`});
        };
    });
}