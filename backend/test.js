const http = require('http');
const assert = require('assert').strict;

// Simple logger for professional output
const logger = {
  info: (msg) => console.log(`\x1b[36mℹ ${msg}\x1b[0m`),
  success: (msg) => console.log(`\x1b[32m✔ ${msg}\x1b[0m`),
  error: (msg) => console.log(`\x1b[31m✖ ${msg}\x1b[0m`),
  header: (msg) => console.log(`\n\x1b[1m\x1b[35m=== ${msg} ===\x1b[0m\n`),
  test: (msg) => console.log(`\x1b[33m▶ ${msg}\x1b[0m`)
};

const request = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    if (body) options.headers['Content-Length'] = Buffer.byteLength(postData);

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: data ? JSON.parse(data) : {}, headers: res.headers });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: data, headers: res.headers });
        }
      });
    });

    req.on('error', (e) => reject(e));
    if (body) req.write(postData);
    req.end();
  });
};

const runTestSuite = async () => {
  logger.header('API Integration Test Suite');
  
  let passed = 0;
  let failed = 0;
  let authToken = null;
  const testEmail = `test.user.${Date.now()}@example.com`;
  const testPassword = 'SecurePassword123!';

  const runTest = async (name, testFn) => {
    logger.test(`Running: ${name}`);
    try {
      await testFn();
      logger.success(`Passed: ${name}\n`);
      passed++;
    } catch (error) {
      logger.error(`Failed: ${name}`);
      logger.error(`Reason: ${error.message}\n`);
      failed++;
    }
  };

  await runTest('Server Health Check (GET /api/health)', async () => {
    const res = await request('GET', '/api/health');
    assert.strictEqual(res.statusCode, 200, `Expected status 200, got ${res.statusCode}`);
    assert.ok(res.body.message, 'Expected health message in response body');
  });

  await runTest('Fetch Products List (GET /api/products)', async () => {
    const res = await request('GET', '/api/products');
    assert.strictEqual(res.statusCode, 200, `Expected status 200, got ${res.statusCode}`);
    assert.ok(Array.isArray(res.body.products), 'Expected products array');
  });

  await runTest('User Registration (POST /api/auth/register)', async () => {
    const res = await request('POST', '/api/auth/register', {
      name: 'Automated Tester',
      email: testEmail,
      password: testPassword
    });
    assert.strictEqual(res.statusCode, 201, `Expected status 201, got ${res.statusCode}`);
    assert.ok(res.body.token, 'Expected JWT token in response');
    authToken = res.body.token; // Save token for future requests
  });

  await runTest('User Profile Fetch with JWT (GET /api/auth/profile)', async () => {
    assert.ok(authToken, 'Auth token is required for this test (did registration fail?)');
    const res = await request('GET', '/api/auth/profile', null, authToken);
    assert.strictEqual(res.statusCode, 200, `Expected status 200, got ${res.statusCode}`);
    assert.strictEqual(res.body.email, testEmail, 'Email mismatch in profile');
  });

  await runTest('User Login (POST /api/auth/login)', async () => {
    const res = await request('POST', '/api/auth/login', {
      email: testEmail,
      password: testPassword
    });
    assert.strictEqual(res.statusCode, 200, `Expected status 200, got ${res.statusCode}`);
    assert.ok(res.body.token, 'Expected JWT token on login');
  });

  // Summary
  logger.header('Test Execution Summary');
  logger.info(`Total Tests : ${passed + failed}`);
  if (failed === 0) {
    logger.success(`All ${passed} tests passed successfully!`);
    process.exit(0);
  } else {
    logger.error(`${failed} out of ${passed + failed} tests failed.`);
    process.exit(1);
  }
};

runTestSuite();
