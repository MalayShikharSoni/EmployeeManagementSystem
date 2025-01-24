import react from "react"



const employees = [
  {
      id: 1,
      email: "e@e.com",
      password: "123",
      firstname: "Aarav",
      tasks: [
          {
              active: true,
              newTask: false,
              completed: false,
              failed: false,
              title: "Code Review",
              description: "Review the latest codebase for bugs and improvements.",
              date: "2025-01-15",
              category: "Development",
          },
          {
              active: false,
              newTask: false,
              completed: true,
              failed: false,
              title: "Team Meeting",
              description: "Discuss project updates and deliverables.",
              date: "2025-01-10",
              category: "Management",
          },
          {
              active: false,
              newTask: false,
              completed: false,
              failed: true,
              title: "Debugging",
              description: "Fix critical issues in the authentication module.",
              date: "2025-01-13",
              category: "Bug Fixing",
          },
      ],
      taskNumbers: {
          active: 1,
          newTask: 0,
          completed: 1,
          failed: 1,
      },
  },
  {
      id: 2,
      email: "employee2@example.com",
      password: "123",
      firstname: "Ishaan",
      tasks: [
          {
              active: true,
              newTask: false,
              completed: false,
              failed: false,
              title: "Database Optimization",
              description: "Improve query performance for reporting.",
              date: "2025-01-15",
              category: "Database",
          },
          {
              active: false,
              newTask: false,
              completed: true,
              failed: false,
              title: "Weekly Report",
              description: "Prepare and submit the weekly progress report.",
              date: "2025-01-12",
              category: "Reporting",
          },
          {
              active: false,
              newTask: false,
              completed: false,
              failed: true,
              title: "UI Fixes",
              description: "Fix layout issues on the user dashboard.",
              date: "2025-01-14",
              category: "Frontend",
          },
      ],
      taskNumbers: {
          active: 1,
          newTask: 0,
          completed: 1,
          failed: 1,
      },
  },
  {
      id: 3,
      email: "employee3@example.com",
      password: "123",
      firstname: "Meera",
      tasks: [
          {
              active: false,
              newTask: true,
              completed: false,
              failed: false,
              title: "API Integration",
              description: "Integrate third-party payment gateway APIs.",
              date: "2025-01-15",
              category: "Backend",
          },
          {
              active: false,
              newTask: false,
              completed: true,
              failed: false,
              title: "Server Maintenance",
              description: "Ensure server uptime and apply patches.",
              date: "2025-01-11",
              category: "Infrastructure",
          },
          {
              active: false,
              newTask: false,
              completed: false,
              failed: true,
              title: "Security Audit",
              description: "Identify vulnerabilities in the system.",
              date: "2025-01-14",
              category: "Security",
          },
      ],
      taskNumbers: {
          active: 0,
          newTask: 1,
          completed: 1,
          failed: 1,
      },
  },
  {
      id: 4,
      email: "employee4@example.com",
      password: "123",
      firstname: "Riya",
      tasks: [
          {
              active: true,
              newTask: false,
              completed: false,
              failed: false,
              title: "Client Presentation",
              description: "Prepare slides for the new feature demo.",
              date: "2025-01-15",
              category: "Client Interaction",
          },
          {
              active: false,
              newTask: false,
              completed: true,
              failed: false,
              title: "Research",
              description: "Analyze competitors' features and strategies.",
              date: "2025-01-10",
              category: "Research",
          },
          {
              active: false,
              newTask: false,
              completed: false,
              failed: true,
              title: "Deployment",
              description: "Deploy the latest version to the staging server.",
              date: "2025-01-13",
              category: "Deployment",
          },
      ],
      taskNumbers: {
          active: 1,
          newTask: 0,
          completed: 1,
          failed: 1,
      },
  },
];



const admin = {
      id: 1,
      email: "admin@example.com",
      password: "123",
      firstname: "Admin"
    }


export const setLocalStorage = () => {
  localStorage.setItem('employees',JSON.stringify(employees))
  localStorage.setItem('admin',JSON.stringify(admin))
}

export const getLocalStorage = () => {
  const employees = JSON.parse(localStorage.getItem('employees'))
  const admin = JSON.parse(localStorage.getItem('admin'))

  return {employees,admin}
}