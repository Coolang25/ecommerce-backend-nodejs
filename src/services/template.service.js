'use strict';

const TEMPLATE = require("../models/template.model");
const { htmlEmailToken } = require("../utils/tem.html");

const newTemplate = async ({
    tem_name,
    tem_id = 10001,
    tem_html
}) => {
    const newTemplate = await TEMPLATE.create({
        tem_id,
        tem_name,
        tem_html: htmlEmailToken()
    });
    return newTemplate;
}

const getTemplate = async ({ tem_name }) => {
    const template = await TEMPLATE.findOne({ tem_name }).lean();

    return template;
}

module.exports = {
    newTemplate,
    getTemplate
}