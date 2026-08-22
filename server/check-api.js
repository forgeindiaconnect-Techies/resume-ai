const http = require('http');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  try {
    const users = await fetchJson('http://localhost:5000/api/user-sessions/users-summary');
    console.log('--- USERS ---');
    console.log(JSON.stringify(users, null, 2).slice(0, 500));

    const downloads = await fetchJson('http://localhost:5000/api/downloads');
    console.log('--- DOWNLOADS ---');
    console.log(JSON.stringify(downloads, null, 2).slice(0, 500));

    const payments = await fetchJson('http://localhost:5000/api/payments');
    console.log('--- PAYMENTS ---');
    console.log(JSON.stringify(payments, null, 2).slice(0, 500));

    const activity = await fetchJson('http://localhost:5000/api/user-sessions');
    console.log('--- ACTIVITY LOGS ---');
    console.log(JSON.stringify(activity, null, 2).slice(0, 500));
  } catch (err) {
    console.error(err);
  }
}
run();
