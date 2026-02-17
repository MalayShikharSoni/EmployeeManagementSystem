const Task = require('./models/taskModel');

async function testTasks() {
  try {
    console.log('Testing Task Model...\n');

    // Test 1: Create a task
    console.log('1. Creating a task...');
    const newTask = await Task.create({
      title: 'Test Task',
      description: 'This is a test task',
      category: 'Development',
      dueDate: '2026-03-01',
      createdBy: 1, // Admin ID
      assignedTo: 2  // Employee ID (make sure this user exists)
    });
    console.log('✅ Task created:', newTask);

    // Test 2: Get tasks for user
    console.log('\n2. Getting tasks for user...');
    const userTasks = await Task.getByUserId(2);
    console.log('✅ User tasks:', userTasks.length);

    // Test 3: Update task status
    console.log('\n3. Accepting task...');
    const acceptedTask = await Task.updateStatus(newTask.id, 'active');
    console.log('✅ Task accepted:', acceptedTask.active);

    // Test 4: Get task counts
    console.log('\n4. Getting task counts...');
    const counts = await Task.getTaskCounts(2);
    console.log('✅ Task counts:', counts);

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testTasks();