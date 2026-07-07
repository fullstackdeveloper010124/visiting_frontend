const BASE_URL = 'https://visiting-backend.onrender.com/api/v1';

async function runTests() {
  console.log('--- STARTING INTEGRATION TESTS FOR LETTERHEAD APPROVAL ---');
  
  try {
    // 1. Authenticate standard user
    console.log('\nStep 1: Logging in as standard user...');
    const userLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@company.com', password: 'user123' })
    });
    
    const userLoginData = await userLoginRes.json();
    if (!userLoginRes.ok || !userLoginData.success) {
      throw new Error(`User login failed: ${JSON.stringify(userLoginData)}`);
    }
    
    const userToken = userLoginData.data.token;
    console.log('✓ Successfully logged in.');

    // 2. Submit letterhead design for approval
    console.log('\nStep 2: Submitting a customized letterhead for approval...');
    const testDesign = {
      measurement: '8.5 x 11 (with watermark)',
      reams: '25 (500/ream)',
      costPerReam: '350',
      inStock: '12500',
      ordered: '500',
      balance: '12000',
      minQuantity: '1500',
      uploadedLetterhead: null
    };
    
    const submitRes = await fetch(`${BASE_URL}/customize-config/send-approval`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ designType: 'letterhead', designDetails: testDesign })
    });
    
    const submitData = await submitRes.json();
    if (!submitRes.ok || !submitData.success) {
      throw new Error(`Letterhead submission failed: ${JSON.stringify(submitData)}`);
    }
    
    const approvalId = submitData.data._id;
    console.log(`✓ Letterhead submitted successfully. Created Approval ID: ${approvalId}`);
    
    if (submitData.data.designType !== 'letterhead') {
      throw new Error(`Expected designType 'letterhead', got '${submitData.data.designType}'`);
    }
    if (submitData.data.status !== 'pending_user_approval') {
      throw new Error(`Expected status 'pending_user_approval', got '${submitData.data.status}'`);
    }
    console.log('✓ Initial status and designType verified.');

    // 3. Fetch single details publicly
    console.log('\nStep 3: Fetching submitted letterhead details publicly...');
    const fetchDetailsRes = await fetch(`${BASE_URL}/customize-config/approval/${approvalId}`);
    const fetchDetailsData = await fetchDetailsRes.json();
    
    if (!fetchDetailsRes.ok || !fetchDetailsData.success) {
      throw new Error(`Failed to fetch approval details: ${JSON.stringify(fetchDetailsData)}`);
    }
    
    if (fetchDetailsData.data.designDetails.measurement !== '8.5 x 11 (with watermark)') {
      throw new Error('Fetched specifications mismatch.');
    }
    console.log('✓ Public details fetch matches the submitted specifications.');

    // 4. Approve design publicly
    console.log('\nStep 4: Approving the letterhead design...');
    const approveRes = await fetch(`${BASE_URL}/customize-config/approve/${approvalId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    const approveData = await approveRes.json();
    if (!approveRes.ok || !approveData.success) {
      throw new Error(`Design approval failed: ${JSON.stringify(approveData)}`);
    }
    
    if (approveData.data.status !== 'approved') {
      throw new Error(`Expected status to change to 'approved', got '${approveData.data.status}'`);
    }
    console.log('✓ Letterhead successfully approved.');

    // 5. Authenticate Super Admin
    console.log('\nStep 5: Logging in as Super Admin...');
    const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'superuser@company.com', password: 'admin123' })
    });
    
    const adminLoginData = await adminLoginRes.json();
    if (!adminLoginRes.ok || !adminLoginData.success) {
      throw new Error(`Admin login failed: ${JSON.stringify(adminLoginData)}`);
    }
    
    const adminToken = adminLoginData.data.token;
    console.log('✓ Successfully logged in as Super Admin.');

    // 6. Fetch approvals dashboard list
    console.log('\nStep 6: Super Admin fetching approvals dashboard list...');
    const getApprovalsRes = await fetch(`${BASE_URL}/customize-config/approvals`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    
    const getApprovalsData = await getApprovalsRes.json();
    if (!getApprovalsRes.ok || !getApprovalsData.success) {
      throw new Error(`Admin fetch approvals failed: ${JSON.stringify(getApprovalsData)}`);
    }
    
    const matchedRequest = getApprovalsData.data.find(app => app._id === approvalId);
    if (!matchedRequest) {
      throw new Error('Super Admin did not find the letterhead approval request in the list.');
    }
    
    if (matchedRequest.designType !== 'letterhead' || matchedRequest.status !== 'approved') {
      throw new Error(`Expected admin view to have status 'approved' and designType 'letterhead', got ${JSON.stringify(matchedRequest)}`);
    }
    console.log('✓ Super Admin dashboard successfully synchronized and updated with approved letterhead.');

    console.log('\n======================================================');
    console.log('ALL TESTS PASSED SUCCESSFULLY! LETTERHEAD APPROVAL FLOW WORKS');
    console.log('======================================================');

  } catch (err) {
    console.error('\n❌ INTEGRATION TEST FAILED:', err.message);
    process.exit(1);
  }
}

runTests();
