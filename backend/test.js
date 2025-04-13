const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function sendRequests(route, numberOfRequests) {
  console.log(`Sending ${numberOfRequests} requests to ${route}`);

  let successfulRequests = 0;
  let failedRequests = 0;

  for (let i = 0; i < numberOfRequests; i++) {
    try {
      await axios.post(`${BASE_URL}${route}`, { data: 'test' });
      successfulRequests++;
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.log('Rate limit exceeded');
      } else {
        console.error('Request failed:', error.message);
      }
      failedRequests++;
    }
  }

  console.log(`Success: ${successfulRequests}, Failed: ${failedRequests}`);
}

async function runTests() {
  await sendRequests('/auth/login', 60); //60 requests for 5 mins

  // Test file upload/download routes
  await sendRequests('/api/files/upload', 110); // 110 requests for15 mins

}
runTests();
