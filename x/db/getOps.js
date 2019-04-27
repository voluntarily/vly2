/* eslint-disable no-console */
const axios = require('axios');

const getData = async url => {
  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

const API_URL = process.env.VLY_URL || 'http://localhost:8000';

// eslint-disable-next-line prefer-template
getData(API_URL + '/api/opportunities');
