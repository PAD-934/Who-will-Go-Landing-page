/**
 * DIAGNOSTIC TOOL - CONFIGURATION CHECKER
 * Run this in browser console to diagnose issues
 * 
 * How to use:
 * 1. Open website in browser
 * 2. Press F12 (Developer Tools)
 * 3. Click "Console" tab
 * 4. Copy and paste this entire function
 * 5. Run: diagnosticCheck()
 * 
 * This will tell you exactly what's wrong
 */

function diagnosticCheck() {
  console.clear();
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('WHO WILL GO - CONFIGURATION DIAGNOSTIC CHECK');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  let issuesFound = 0;
  
  // CHECK 1: CONFIG Object
  console.log('✓ CHECK 1: CONFIG Object');
  if (typeof CONFIG === 'undefined') {
    console.error('  ❌ CONFIG not defined');
    issuesFound++;
  } else {
    console.log('  ✅ CONFIG defined');
  }
  
  // CHECK 2: Google Apps Script URL
  console.log('\n✓ CHECK 2: Google Apps Script URL');
  if (!CONFIG.GOOGLE_APPS_SCRIPT_URL) {
    console.error('  ❌ GOOGLE_APPS_SCRIPT_URL is EMPTY');
    console.error('  ➜ FIX: Paste your Web App URL in script.js');
    console.error('  ➜ Example: https://script.google.com/macros/d/YOUR_ID/usercopy');
    issuesFound++;
  } else if (CONFIG.GOOGLE_APPS_SCRIPT_URL.includes('YOUR_')) {
    console.error('  ❌ GOOGLE_APPS_SCRIPT_URL still contains placeholder');
    console.error('  ➜ Current value: ' + CONFIG.GOOGLE_APPS_SCRIPT_URL);
    console.error('  ➜ FIX: Replace with actual Web App URL');
    issuesFound++;
  } else if (!CONFIG.GOOGLE_APPS_SCRIPT_URL.includes('script.google.com')) {
    console.error('  ❌ GOOGLE_APPS_SCRIPT_URL looks invalid');
    console.error('  ➜ Current value: ' + CONFIG.GOOGLE_APPS_SCRIPT_URL);
    console.error('  ➜ Should start with: https://script.google.com/macros/d/');
    issuesFound++;
  } else if (!CONFIG.GOOGLE_APPS_SCRIPT_URL.includes('/usercopy')) {
    console.error('  ❌ GOOGLE_APPS_SCRIPT_URL missing /usercopy ending');
    console.error('  ➜ Current value: ' + CONFIG.GOOGLE_APPS_SCRIPT_URL);
    console.error('  ➜ Should end with: /usercopy');
    issuesFound++;
  } else {
    console.log('  ✅ GOOGLE_APPS_SCRIPT_URL is configured');
    console.log('  ➜ Value: ' + CONFIG.GOOGLE_APPS_SCRIPT_URL.substring(0, 80) + '...');
  }
  
  // CHECK 3: HTML Elements
  console.log('\n✓ CHECK 3: Required HTML Elements');
  const requiredElements = [
    'fname', 'fphone', 'femail', 'faddress', 'fsize', 'fpayment', 'fnotes',
    'productsGrid', 'cartBody', 'cartCount', 'cartTotal', 'submitBtn',
    'orderForm', 'successMsg', 'displayOrderId', 'toast'
  ];
  
  let missingElements = [];
  requiredElements.forEach(id => {
    if (!document.getElementById(id)) {
      missingElements.push(id);
    }
  });
  
  if (missingElements.length > 0) {
    console.error(`  ❌ Missing ${missingElements.length} required HTML elements:`);
    missingElements.forEach(id => {
      console.error(`     - #${id} not found`);
    });
    issuesFound++;
  } else {
    console.log(`  ✅ All ${requiredElements.length} required HTML elements found`);
  }
  
  // CHECK 4: Form Functionality
  console.log('\n✓ CHECK 4: Form Functions');
  const requiredFunctions = [
    'renderProducts', 'addToCart', 'removeFromCart', 'updateCart',
    'submitOrder', 'validateForm', 'validateProducts', 'isValidEmail',
    'submitToGoogleSheets', 'showToast'
  ];
  
  let missingFunctions = [];
  requiredFunctions.forEach(fn => {
    if (typeof window[fn] !== 'function') {
      missingFunctions.push(fn);
    }
  });
  
  if (missingFunctions.length > 0) {
    console.error(`  ❌ Missing ${missingFunctions.length} required functions:`);
    missingFunctions.forEach(fn => {
      console.error(`     - ${fn}() not found`);
    });
    issuesFound++;
  } else {
    console.log(`  ✅ All ${requiredFunctions.length} required functions found`);
  }
  
  // CHECK 5: Products
  console.log('\n✓ CHECK 5: Products Data');
  if (typeof products === 'undefined') {
    console.error('  ❌ products array not defined');
    issuesFound++;
  } else if (products.length === 0) {
    console.error('  ❌ products array is empty');
    issuesFound++;
  } else {
    console.log(`  ✅ ${products.length} products loaded`);
  }
  
  // CHECK 6: Network Connectivity
  console.log('\n✓ CHECK 6: Network Connectivity');
  console.log('  ℹ️  Will test after you submit an order');
  
  // CHECK 7: Browser Environment
  console.log('\n✓ CHECK 7: Browser Environment');
  console.log(`  ✅ Browser: ${navigator.userAgent.split(' ').slice(-1)[0]}`);
  console.log(`  ✅ JavaScript enabled`);
  console.log(`  ✅ Fetch API available: ${typeof fetch === 'function' ? 'Yes' : 'No'}`);
  
  // SUMMARY
  console.log('\n═══════════════════════════════════════════════════════════════');
  if (issuesFound === 0) {
    console.log('✅ ALL CHECKS PASSED - System is configured correctly!');
    console.log('\nYou can now submit an order. Try it with test data.');
    console.log('\nIf you still get an error when submitting, the issue is likely:');
    console.log('1. Web App URL is incorrect');
    console.log('2. Google Apps Script backend not deployed');
    console.log('3. Network/CORS issue');
    console.log('\nCheck the Network tab (F12) when you submit to see if request succeeds.');
  } else {
    console.log(`❌ ${issuesFound} ISSUE(S) FOUND - Follow the fixes above`);
    console.log('\nMost common fix: Paste Web App URL in script.js CONFIG');
  }
  console.log('═══════════════════════════════════════════════════════════════\n');
}

// AUTO-RUN on page load
document.addEventListener('DOMContentLoaded', function() {
  console.log('WHO WILL GO - Loaded');
  console.log('Run: diagnosticCheck() to diagnose configuration issues');
});
