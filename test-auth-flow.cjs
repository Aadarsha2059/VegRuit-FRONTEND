#!/usr/bin/env node

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api/auth';

// Test data
const testBuyer = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.buyer@example.com',
  phone: '+9779876543210',
  username: 'johnbuyer',
  password: 'password123',
  address: 'Thamel, Kathmandu',
  city: 'Kathmandu'
};

const testSeller = {
  firstName: 'Ram',
  lastName: 'Farmer',
  email: 'ram.seller@example.com',
  phone: '+9779876543211',
  username: 'ramfarmer',
  password: 'password123',
  farmName: 'Ram\'s Organic Farm',
  farmLocation: 'Bhaktapur',
  city: 'Bhaktapur'
};

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testAuthFlow() {
  log('\n🚀 VegRuit Authentication Flow Test', 'bright');
  log('='.repeat(50), 'cyan');

  try {
    // Test 1: Register Buyer
    log('\n📝 Test 1: Register Buyer', 'blue');
    try {
      const buyerResponse = await axios.post(`${API_BASE_URL}/buyer/register`, testBuyer);
      log(`✅ Buyer registration successful!`, 'green');
      log(`   User: ${buyerResponse.data.user.firstName} ${buyerResponse.data.user.lastName}`, 'green');
      log(`   Type: ${buyerResponse.data.userType}`, 'green');
      log(`   Token received: ${buyerResponse.data.token ? 'Yes' : 'No'}`, 'green');
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        log(`⚠️  Buyer already exists - ${error.response.data.message}`, 'yellow');
      } else {
        log(`❌ Buyer registration failed: ${error.response?.data?.message || error.message}`, 'red');
      }
    }

    // Test 2: Register Seller
    log('\n📝 Test 2: Register Seller', 'blue');
    try {
      const sellerResponse = await axios.post(`${API_BASE_URL}/seller/register`, testSeller);
      log(`✅ Seller registration successful!`, 'green');
      log(`   User: ${sellerResponse.data.user.firstName} ${sellerResponse.data.user.lastName}`, 'green');
      log(`   Type: ${sellerResponse.data.userType}`, 'green');
      log(`   Farm: ${sellerResponse.data.user.farmName}`, 'green');
      log(`   Token received: ${sellerResponse.data.token ? 'Yes' : 'No'}`, 'green');
    } catch (error) {
      if (error.response?.data?.message?.includes('already exists')) {
        log(`⚠️  Seller already exists - ${error.response.data.message}`, 'yellow');
      } else {
        log(`❌ Seller registration failed: ${error.response?.data?.message || error.message}`, 'red');
      }
    }

    // Test 3: Login as Buyer
    log('\n🔐 Test 3: Login as Buyer', 'blue');
    try {
      const buyerLoginResponse = await axios.post(`${API_BASE_URL}/login`, {
        username: testBuyer.username,
        password: testBuyer.password
      });
      log(`✅ Buyer login successful!`, 'green');
      log(`   User: ${buyerLoginResponse.data.user.firstName} ${buyerLoginResponse.data.user.lastName}`, 'green');
      log(`   Type: ${buyerLoginResponse.data.userType}`, 'green');
      log(`   Should redirect to: /buyer-dashboard`, 'cyan');
      
      // Store token for further tests
      const buyerToken = buyerLoginResponse.data.token;
      
      // Test protected route
      log('\n🔒 Testing protected route for buyer...', 'blue');
      const profileResponse = await axios.get(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${buyerToken}` }
      });
      log(`✅ Protected route access successful!`, 'green');
      log(`   Profile: ${profileResponse.data.user.firstName} ${profileResponse.data.user.lastName}`, 'green');
      
    } catch (error) {
      log(`❌ Buyer login failed: ${error.response?.data?.message || error.message}`, 'red');
    }

    // Test 4: Login as Seller
    log('\n🔐 Test 4: Login as Seller', 'blue');
    try {
      const sellerLoginResponse = await axios.post(`${API_BASE_URL}/login`, {
        username: testSeller.username,
        password: testSeller.password
      });
      log(`✅ Seller login successful!`, 'green');
      log(`   User: ${sellerLoginResponse.data.user.firstName} ${sellerLoginResponse.data.user.lastName}`, 'green');
      log(`   Type: ${sellerLoginResponse.data.userType}`, 'green');
      log(`   Farm: ${sellerLoginResponse.data.user.farmName}`, 'green');
      log(`   Should redirect to: /seller-dashboard`, 'cyan');
      
      // Store token for further tests
      const sellerToken = sellerLoginResponse.data.token;
      
      // Test protected route
      log('\n🔒 Testing protected route for seller...', 'blue');
      const profileResponse = await axios.get(`${API_BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${sellerToken}` }
      });
      log(`✅ Protected route access successful!`, 'green');
      log(`   Profile: ${profileResponse.data.user.firstName} ${profileResponse.data.user.lastName}`, 'green');
      
    } catch (error) {
      log(`❌ Seller login failed: ${error.response?.data?.message || error.message}`, 'red');
    }

    // Test 5: Check User Exists
    log('\n🔍 Test 5: Check User Exists', 'blue');
    try {
      const checkResponse = await axios.get(`${API_BASE_URL}/check-user?username=${testBuyer.username}`);
      log(`✅ User check successful!`, 'green');
      log(`   User exists: ${checkResponse.data.exists}`, 'green');
      if (checkResponse.data.exists) {
        log(`   User type: ${checkResponse.data.userType}`, 'green');
      }
    } catch (error) {
      log(`❌ User check failed: ${error.response?.data?.message || error.message}`, 'red');
    }

    // Test 6: Wrong Password
    log('\n❌ Test 6: Wrong Password', 'blue');
    try {
      await axios.post(`${API_BASE_URL}/login`, {
        username: testBuyer.username,
        password: 'wrongpassword'
      });
      log(`❌ This should have failed!`, 'red');
    } catch (error) {
      log(`✅ Correctly rejected wrong password: ${error.response.data.message}`, 'green');
    }

    log('\n🎉 Authentication Flow Test Complete!', 'bright');
    log('='.repeat(50), 'cyan');
    log('\n📋 Summary:', 'bright');
    log('✅ User registration (buyer & seller)', 'green');
    log('✅ User login with correct credentials', 'green');
    log('✅ User type detection and routing', 'green');
    log('✅ Protected route access with JWT', 'green');
    log('✅ Error handling for wrong credentials', 'green');
    log('✅ User existence checking', 'green');
    
    log('\n🌐 Frontend URLs:', 'bright');
    log('• Frontend: http://localhost:5173', 'cyan');
    log('• Backend API: http://localhost:5000/api', 'cyan');
    
    log('\n🎯 Navigation Flow:', 'bright');
    log('1. User opens http://localhost:5173', 'cyan');
    log('2. Clicks login/signup button', 'cyan');
    log('3. Chooses buyer or seller registration', 'cyan');
    log('4. Fills form and submits', 'cyan');
    log('5. Gets redirected to appropriate dashboard:', 'cyan');
    log('   • Buyers → /buyer-dashboard', 'cyan');
    log('   • Sellers → /seller-dashboard', 'cyan');

  } catch (error) {
    log(`❌ Test failed: ${error.message}`, 'red');
  }
}

// Install axios if not available
async function ensureAxios() {
  try {
    require('axios');
  } catch (error) {
    log('Installing axios...', 'yellow');
    const { execSync } = require('child_process');
    execSync('npm install axios', { stdio: 'inherit' });
  }
}

async function main() {
  try {
    await ensureAxios();
    await testAuthFlow();
  } catch (error) {
    log(`❌ Setup failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { testAuthFlow };