const dotenv = require('dotenv');
dotenv.config();

const logger = require('../utils/logger');

const number = process.env.CONTACT_NUMBER;
const contactEmail = process.env.CONTACT_EMAIL;

exports.getILYTATContactInfo = async (req, res) => {
    logger.info('Getting ILYTAT contact info');
    res.json({
        contactNumber: number,
        contactEmail: contactEmail
    });
}