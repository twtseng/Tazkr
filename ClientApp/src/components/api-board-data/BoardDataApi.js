import React from 'react';
import authService from '../api-authorization/AuthorizeService';

export default async (url = '', method='GET', data = {}) => {
    console.log(`BoardDataApi, url[${url}] method[${method}] data[${data}]`);
    try
    {
        const token = await authService.getAccessToken();
        const response = await fetch(url, {
            method: method, // *GET, POST, PUT, DELETE, etc.
            mode: 'same-origin', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
            // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: method === "GET" ? null : JSON.stringify(data) // body data type must match "Content-Type" header
        });
        const jsonResult = await response.json(); // parses JSON response into native JavaScript objects
        return jsonResult
    } catch (e) {
        console.log(`BoardDataApi failed: error=${e}`);
        return [];
    }
}
