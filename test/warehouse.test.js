const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;

const baseUrl = 'https://easecommerce.in';
let token; // Store token globally

describe('Warehouse API - Complete Test Suite', function () {

  // Step 1: Login and retrieve token
  before(async function () {
    const loginPayload = {
      username: 'username',
      password: 'password'
    };

    const res = await request(baseUrl)
      .post('/api/v2/login')
      .send(loginPayload);

    expect(res.status).to.be.oneOf([200,201]);
    expect(res.body).to.have.property('token');
    token = res.body.token;
    console.log(token)
  });

  // ✅ POSITIVE TEST
  it('should return list of warehouses for group=default and verify for the warehouse list in JSON', async function () {
    const res = await request(baseUrl)
      .get('/api/v2/manage/warehouse/master/list?page=1&limit=10&offset=0group=default')
      .set('Authorization', `Bearer ${token}`);

        // Check status and content type
        expect(res.status).to.equal(200);
        expect(res.type).to.equal('application/json');
    
        // Check structure
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('docs').that.is.an('array');
   
  });

  // Negative Test 1: Invalid token
  it('should return 401 Unauthorized for invalid token', async function () {
    const res = await request(baseUrl)
      .get('/api/v2/manage/warehouse/master/12345')
      .set('Authorization', 'Bearer invalidtoken');

    expect(res.status).to.equal(401);
  });

  // Negative Test 2: Missing warehouse ID
  it('should return 404 or 400 for missing warehouse ID', async function () {
    const res = await request(baseUrl)
      .get('/api/v2/manage/warehouse/master/')
      .set('Authorization', `Bearer ${token}`);

    expect([400, 404]).to.include(res.status);
  });

  //  Negative Test 3: Non-existent warehouse ID
  it('should return 404 or empty response for non-existent warehouse for the given group and Validated for reposne handled properly', async function () {
    const res = await request(baseUrl)
      .get('/api/v2/manage/warehouse/master/9999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).to.be.oneOf([200, 404]);
    if (res.status === 200) {
      expect(res.body).to.be.empty;
    }
  });

});
