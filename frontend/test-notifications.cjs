const axios = require('axios');
const io = require('socket.io-client');

const API_URL = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

async function runTest() {
  try {
    console.log('1. Registering test admin...');
    const adminEmail = `admin_${Date.now()}@test.com`;
    let adminToken;
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        firstName: 'TestAdmin',
        email: adminEmail,
        password: 'password123',
        role: 'admin'
      });
      adminToken = res.data.data.accessToken;
      console.log('Admin registered.');
    } catch (e) {
      console.error('Failed to register admin:', e.response?.data || e.message);
      return;
    }

    console.log('2. Registering test employee...');
    const empEmail = `emp_${Date.now()}@test.com`;
    let empToken;
    let empId;
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        firstName: 'TestEmp',
        email: empEmail,
        password: 'password123',
        role: 'employee'
      });
      empToken = res.data.data.accessToken;
      empId = res.data.data.user.id;
      console.log('Employee registered. ID:', empId);
    } catch (e) {
      console.error('Failed to register employee:', e.response?.data || e.message);
      return;
    }

    console.log('3. Connecting employee socket...');
    const socket = io(SOCKET_URL, {
      auth: { token: empToken }
    });

    let notificationReceived = false;
    socket.on('notification:new', (notif) => {
      console.log('>>> SOCKET EVENT RECEIVED: notification:new');
      console.log(notif);
      notificationReceived = true;
    });

    socket.on('connect', async () => {
      console.log('Employee socket connected.');

      // Admin sends invitation
      console.log('4. Admin sending invitation...');
      try {
        await axios.post(`${API_URL}/invitations/send`, { employeeId: empId }, {
          headers: { Authorization: `Bearer ${adminToken}` }
        });
        console.log('Invitation sent successfully.');
      } catch (e) {
        console.error('Failed to send invite:', e.response?.data || e.message);
      }

      // Wait a moment for socket event
      setTimeout(async () => {
        if (notificationReceived) {
          console.log('SUCCESS! Real-time notification received over socket.');
        } else {
          console.error('FAILURE! No notification received over socket.');
        }

        // Check REST API
        console.log('5. Checking REST API for unread count...');
        try {
          const res = await axios.get(`${API_URL}/notifications/unread-count`, {
            headers: { Authorization: `Bearer ${empToken}` }
          });
          console.log('Unread count:', res.data.data.count);
          if (res.data.data.count > 0) {
            console.log('SUCCESS! REST API reports unread notifications.');
          } else {
            console.error('FAILURE! REST API reports 0 unread notifications.');
          }
        } catch (e) {
          console.error('Failed to fetch unread count:', e.response?.data || e.message);
        }

        socket.disconnect();
        process.exit(notificationReceived ? 0 : 1);
      }, 2000);
    });

  } catch (error) {
    console.error('Test failed with error:', error);
    process.exit(1);
  }
}

runTest();
