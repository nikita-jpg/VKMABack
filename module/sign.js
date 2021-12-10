'use strict';

const qs = require('querystring');
const crypto = require('crypto');

module.exports = (_token) => {
    if (_token) {
        let _url_params = qs.parse(_token);
        let ordered = {};
        Object.keys(_url_params).sort().forEach((key) => {
            if (key.slice(0, 3) === 'vk_') {
                ordered[key] = _url_params[key];
            }
        });
        const stringParams = qs.stringify(ordered);
        const paramsHash = crypto
            .createHmac('sha256', "4kzspMUxNodCB9w28uI7")
            .update(stringParams)
            .digest()
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=$/, '');

        return paramsHash === _url_params?.sign ?
                              _url_params : undefined
    }
    else {
        return undefined;
    }
}