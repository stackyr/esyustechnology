// Verification script for Esyus Backend API & Data Handling with Security Auth
const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('--- STARTING ESYUS SECURE BACKEND API VERIFICATION SUITE ---\n');
  let passed = 0;
  let failed = 0;
  let adminToken = null;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`✗ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Health check (Public)
  await test('GET /api/health returns ok', async () => {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    if (data.status !== 'ok') throw new Error('Status is not ok');
  });

  // 2. Overview metrics (Public)
  await test('GET /api/overview returns metrics', async () => {
    const res = await fetch(`${API_BASE}/overview`);
    const data = await res.json();
    if (!data.success || typeof data.data.totalInquiries !== 'number') {
      throw new Error('Invalid overview payload');
    }
  });

  // 3. Contact Inquiries from Website Visitor (Public)
  let createdInqId = null;
  await test('POST /api/inquiries registers new visitor inquiry from website', async () => {
    const payload = {
      name: 'Milan Test Visitor',
      mobile: '+91 98765 00000',
      email: 'milan.test@example.com',
      address: 'Kolkata Sector V',
      subject: 'Finance Flow Desktop Billing',
      message: 'Need GST offline billing machine for retail shop.',
      type: 'enquiry'
    };
    const res = await fetch(`${API_BASE}/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    if (!data.success || !data.data.id) throw new Error('Inquiry creation failed');
    createdInqId = data.data.id;
    if (data.data.status !== 'new') throw new Error('Initial status should be "new"');
  });

  // 4. Security Check: Reject Unauthenticated Admin Mutation
  await test('Security: Reject unauthenticated PUT /api/brand without admin token (401)', async () => {
    const res = await fetch(`${API_BASE}/brand`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Hacker Attempt' })
    });
    if (res.status !== 401) throw new Error(`Expected 401 Unauthorized, got ${res.status}`);
  });

  // 5. Admin Credentials Authentication & Token Acquisition
  await test('Admin Credentials Authentication (POST /api/admin/login)', async () => {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'admin' })
    });
    const data = await res.json();
    if (!data.success || !data.token) throw new Error('Admin login failed');
    adminToken = data.token;

    // Test token verification
    const verifyRes = await fetch(`${API_BASE}/admin/verify`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const verifyData = await verifyRes.json();
    if (!verifyData.valid) throw new Error('Admin token verification failed');
  });

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  });

  // 6. Verify inquiry appears in GET /api/inquiries
  await test('GET /api/inquiries lists newly created inquiry at top', async () => {
    const res = await fetch(`${API_BASE}/inquiries`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.data)) throw new Error('Failed to list inquiries');
    const found = data.data.find(i => i.id === createdInqId);
    if (!found) throw new Error('Created inquiry not found in list');
    if (data.data[0].id !== createdInqId) throw new Error('Newest inquiry should be at the top');
  });

  // 7. Update inquiry status with Admin Token
  await test('PATCH /api/inquiries/:id updates status to "in_progress" (Authorized)', async () => {
    const res = await fetch(`${API_BASE}/inquiries/${createdInqId}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status: 'in_progress', notes: 'Called customer; demo scheduled.' })
    });
    const data = await res.json();
    if (!data.success || data.data.status !== 'in_progress') throw new Error('Failed to update status');
  });

  // 8. Delete inquiry with Admin Token
  await test('DELETE /api/inquiries/:id removes inquiry (Authorized)', async () => {
    const res = await fetch(`${API_BASE}/inquiries/${createdInqId}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    const data = await res.json();
    if (!data.success) throw new Error('Inquiry deletion failed');
  });

  // 9. Brand GET & PUT (Authorized)
  await test('GET /api/brand and PUT /api/brand update brand info (Authorized)', async () => {
    const getRes = await fetch(`${API_BASE}/brand`);
    const getData = await getRes.json();
    if (!getData.success || !getData.data.name) throw new Error('GET brand failed');

    const originalTagline = getData.data.tagline;
    const putRes = await fetch(`${API_BASE}/brand`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ tagline: 'Secured MERN Architecture' })
    });
    const putData = await putRes.json();
    if (!putData.success || putData.data.tagline !== 'Secured MERN Architecture') {
      throw new Error('PUT brand failed');
    }

    // Revert
    await fetch(`${API_BASE}/brand`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ tagline: originalTagline })
    });
  });

  // 10. Services CRUD (Authorized)
  let testServiceId = null;
  await test('Services CRUD with Admin Authorization (Add, Update, Delete)', async () => {
    // Add
    const addRes = await fetch(`${API_BASE}/services`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        title: 'Microservices Architecture',
        shortDesc: 'Scalable backend API clusters',
        fullDesc: 'Enterprise architecture for high-traffic commerce.',
        badge: 'New Service',
        iconName: 'Server',
        features: ['Docker deployment', 'Zero downtime'],
        techStack: ['Node.js', 'Express', 'MongoDB']
      })
    });
    const addData = await addRes.json();
    if (!addData.success || !addData.data.id) throw new Error('Service add failed');
    testServiceId = addData.data.id;

    // Update
    const updateRes = await fetch(`${API_BASE}/services/${testServiceId}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ shortDesc: 'Updated scalable backend clusters' })
    });
    const updateData = await updateRes.json();
    if (!updateData.data.shortDesc.includes('Updated')) throw new Error('Service update failed');

    // Delete
    const delRes = await fetch(`${API_BASE}/services/${testServiceId}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    const delData = await delRes.json();
    if (!delData.success) throw new Error('Service delete failed');
  });

  // 11. Products & Specs CRUD (Authorized)
  let testProductId = null;
  await test('Products & Specs CRUD with Admin Authorization (Add, Update specs, Delete)', async () => {
    // Add
    const addRes = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        name: 'Warehouse Flow',
        category: 'Inventory Suite',
        platform: 'Windows / Linux',
        version: 'v2.1.0',
        size: '35 MB',
        highlights: ['Barcode scanner sync', 'Multi-aisle layout'],
        tagline: 'Logistics tracking software'
      })
    });
    const addData = await addRes.json();
    if (!addData.success || !addData.data.id) throw new Error('Product add failed');
    testProductId = addData.data.id;

    // Update
    const updateRes = await fetch(`${API_BASE}/products/${testProductId}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ size: '38 MB', highlights: ['Barcode scanner sync', 'Updated warehouse logic'] })
    });
    const updateData = await updateRes.json();
    if (updateData.data.size !== '38 MB') throw new Error('Product update failed');

    // Delete
    const delRes = await fetch(`${API_BASE}/products/${testProductId}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    const delData = await delRes.json();
    if (!delData.success) throw new Error('Product delete failed');
  });

  // 12. FAQs CRUD (Authorized)
  let testFaqId = null;
  await test('FAQs CRUD with Admin Authorization (Add, Update, Delete)', async () => {
    // Add
    const addRes = await fetch(`${API_BASE}/faqs`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({
        q: 'Can Finance Flow run on multiple networked local LAN counters?',
        a: 'Yes, Finance Flow supports multi-counter local network operation sharing one local database server without internet.'
      })
    });
    const addData = await addRes.json();
    if (!addData.success || !addData.data.id) throw new Error('FAQ add failed');
    testFaqId = addData.data.id;

    // Update
    const updateRes = await fetch(`${API_BASE}/faqs/${testFaqId}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({
        a: 'Updated answer: Yes, Finance Flow supports up to 10 local LAN billing counters.'
      })
    });
    const updateData = await updateRes.json();
    if (!updateData.data.a.includes('up to 10')) throw new Error('FAQ update failed');

    // Delete
    const delRes = await fetch(`${API_BASE}/faqs/${testFaqId}`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    const delData = await delRes.json();
    if (!delData.success) throw new Error('FAQ delete failed');
  });

  // 13. Landing Page Sections & Visuals (Authorized)
  await test('Landing Page & Visual Images Customization with Admin Authorization (GET & PUT)', async () => {
    const getRes = await fetch(`${API_BASE}/landing-page`);
    const getData = await getRes.json();
    if (!getData.success || !getData.data) throw new Error('GET /api/landing-page failed');

    const originalTitle = getData.data.hero?.title || 'Engineered for speed, built for reliability';

    // Update hero title and an image URL
    const updateRes = await fetch(`${API_BASE}/landing-page`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({
        hero: {
          title: 'Customized Hero Test Title',
          collageA1: 'https://images.unsplash.com/photo-test-url-123'
        }
      })
    });
    const updateData = await updateRes.json();
    if (!updateData.success || updateData.data.hero?.title !== 'Customized Hero Test Title') {
      throw new Error('Landing page PUT update failed');
    }

    // Revert
    await fetch(`${API_BASE}/landing-page`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({
        hero: {
          title: originalTitle,
          collageA1: getData.data.hero?.collageA1 || 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&q=80&w=800'
        }
      })
    });
  });

  console.log(`\n--- TEST SUMMARY ---`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

runTests();
