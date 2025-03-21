import react from "react";

const employees = [
  {
    id: 1,
    email: "aarav@employee.com",
    password: "123",
    firstname: "Aarav",
    tasks: [
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Code Review",
        description: "Review the latest codebase for bugs and improvements. Ensure code quality is up to standards.",
        date: "2025-01-15",
        category: "Development",
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Feature Implementation",
        description: "Develop a new module for user authentication. Implement a secure authentication system.",
        date: "2025-01-16",
        category: "Development",
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "API Testing",
        description: "Test API endpoints for performance and security. Ensure API endpoints are secure and performant.",
        date: "2025-01-17",
        category: "Testing",
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Database Optimization",
        description: "Improve database query performance. Optimize database query performance for better app load times.",
        date: "2025-01-18",
        category: "Database",
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "UI Enhancement",
        description: "Improve the UI components for better UX. Improve the user experience with better UI components.",
        date: "2025-01-19",
        category: "Frontend",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "New Feature Planning",
        description: "Plan a new feature for the upcoming sprint. Plan a new feature to improve the overall app experience.",
        date: "2025-01-20",
        category: "Planning",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "User Research",
        description: "Gather feedback on the new dashboard. Gather user feedback on the new dashboard.",
        date: "2025-01-21",
        category: "Research",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Security Audit",
        description: "Perform a security audit on the system. Perform a security audit to identify vulnerabilities.",
        date: "2025-01-22",
        category: "Security",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Performance Tuning",
        description: "Optimize application performance. Optimize the app for better performance.",
        date: "2025-01-23",
        category: "Performance",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Code Refactoring",
        description: "Refactor existing code for better readability. Refactor code for better readability.",
        date: "2025-01-24",
        category: "Development",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Bug Fixing",
        description: "Resolve reported UI bugs. Fix bugs in the app to improve user experience.",
        date: "2025-01-10",
        category: "Bug Fixing",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Project Documentation",
        description: "Update project documentation. Update the project documentation to reflect the latest changes.",
        date: "2025-01-11",
        category: "Documentation",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Team Meeting",
        description: "Discuss progress and next steps. Discuss the project progress and plan the next steps.",
        date: "2025-01-12",
        category: "Management",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "System Backup",
        description: "Ensure all important data is backed up. Ensure important data is backed up to prevent data loss.",
        date: "2025-01-13",
        category: "Infrastructure",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Stakeholder Meeting",
        description: "Present project updates to stakeholders. Present project updates to stakeholders.",
        date: "2025-01-14",
        category: "Business",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Server Downtime Fix",
        description: "Resolve critical server outage. Fix critical server outage to ensure app availability.",
        date: "2025-01-25",
        category: "Infrastructure",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Data Migration Issue",
        description: "Fix issues encountered during database migration. Fix database migration issues to ensure data integrity.",
        date: "2025-01-26",
        category: "Database",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Buggy Feature Rollback",
        description: "Rollback a feature causing system failures. Rollback a feature causing system failures to prevent app crashes.",
        date: "2025-01-27",
        category: "Bug Fixing",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Customer Complaint Handling",
        description: "Resolve complaints about payment processing errors. Resolve customer complaints about payment processing errors.",
        date: "2025-01-28",
        category: "Support",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Security Breach Response",
        description: "Investigate and mitigate security breach attempt. Mitigate security breach attempt to protect user data.",
        date: "2025-01-29",
        category: "Security",
      }
    ],
    taskNumbers: {
      active: 5,
      newTask: 5,
      completed: 5,
      failed: 5,
    },
  },

  {
    id: 2,
    email: "vihaan@employee.com",
    password: "123",
    firstname: "Vihaan",
    tasks: [
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Sprint Planning",
        description: "Organize and prioritize tasks for the next sprint. Ensure that all team members are on the same page and that the tasks are aligned with the project goals.",
        date: "2025-02-01",
        category: "Management",
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Bug Triage",
        description: "Analyze and categorize newly reported bugs. Prioritize bugs based on their impact on the application and assign them to team members for resolution.",
        date: "2025-02-02",
        category: "Bug Fixing",
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Backend Optimization",
        description: "Refactor backend code for performance improvements. Optimize database queries, implement caching and indexing, and refactor code for better readability.",
        date: "2025-02-03",
        category: "Development",
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "UI Testing",
        description: "Test UI responsiveness across multiple devices. Ensure that the application is responsive and user-friendly on different devices and screen sizes.",
        date: "2025-02-04",
        category: "Testing",
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Security Patch Deployment",
        description: "Deploy security fixes to production servers. Ensure that all security patches are up-to-date and that the application is secure.",
        date: "2025-02-05",
        category: "Security",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "User Experience Survey",
        description: "Collect feedback from users on the latest update. Analyze the feedback to identify areas of improvement and prioritize tasks accordingly.",
        date: "2025-02-06",
        category: "Research",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Cloud Migration",
        description: "Migrate legacy services to cloud infrastructure. Ensure that all services are migrated and that the application is running smoothly in the cloud.",
        date: "2025-02-07",
        category: "Infrastructure",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Documentation Review",
        description: "Ensure all API documentation is up-to-date. Review and update the documentation to reflect the latest changes in the application.",
        date: "2025-02-08",
        category: "Documentation",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Performance Benchmarking",
        description: "Measure app performance against competitors. Analyze the performance data to identify areas of improvement and optimize the application for better performance.",
        date: "2025-02-09",
        category: "Performance",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Accessibility Enhancements",
        description: "Improve accessibility features for visually impaired users. Ensure that the application is accessible and user-friendly for all users.",
        date: "2025-02-10",
        category: "Frontend",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Code Review Session",
        description: "Review pull requests and provide feedback. Ensure that all code is reviewed and that the feedback is constructive and actionable.",
        date: "2025-01-28",
        category: "Development",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Incident Report Analysis",
        description: "Analyze past incidents for root causes. Identify the root causes of the incidents and implement measures to prevent them from happening again.",
        date: "2025-01-29",
        category: "Security",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Deployment Pipeline Setup",
        description: "Implement a CI/CD pipeline for faster releases. Ensure that the pipeline is set up and that the application is deployed quickly and efficiently.",
        date: "2025-01-30",
        category: "Infrastructure",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Customer Support Training",
        description: "Train support team on handling new feature queries. Ensure that the support team is knowledgeable and equipped to handle customer queries.",
        date: "2025-01-31",
        category: "Support",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Legal Compliance Check",
        description: "Ensure all software licenses are up to date. Ensure that all software licenses are up-to-date and that the application is compliant with all relevant laws and regulations.",
        date: "2025-02-01",
        category: "Business",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Server Crash Recovery",
        description: "Recover from a recent unexpected server crash. Identify the root cause of the crash and implement measures to prevent it from happening again.",
        date: "2025-02-02",
        category: "Infrastructure",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Broken Feature Rollback",
        description: "Revert a feature causing regressions in production. Identify the root cause of the issue and implement a fix to prevent it from happening again.",
        date: "2025-02-03",
        category: "Bug Fixing",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Unsuccessful Patch Deployment",
        description: "Investigate and fix issues in a failed patch update. Identify the root cause of the issue and implement a fix to prevent it from happening again.",
        date: "2025-02-04",
        category: "Security",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Payment Gateway Downtime",
        description: "Resolve downtime issues affecting online payments. Identify the root cause of the issue and implement a fix to prevent it from happening again.",
        date: "2025-02-05",
        category: "Support",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Network Outage Resolution",
        description: "Diagnose and fix network connectivity issues. Identify the root cause of the issue and implement a fix to prevent it from happening again.",
        date: "2025-02-06",
        category: "Infrastructure",
      }
    ],
    taskNumbers: {
      active: 5,
      newTask: 5,
      completed: 5,
      failed: 5,
    },
  },

  {
    id: 3,
    email: "arjun@employee.com",
    password: "456",
    firstname: "Arjun",
    tasks: [
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Implement Redux in Project",
        description: "Integrate Redux as the state management library. Implement the store, actions, reducers and connect components to the store.",
        date: "2025-02-01",
        category: "Frontend",
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Optimize Backend Queries",
        description: "Refactor API calls to reduce response time. Implement caching and indexing. Optimize database queries.",
        date: "2025-02-02",
        category: "Backend",
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Setup CI/CD Pipeline",
        description: "Automate deployment using GitHub Actions. Implement a workflow that builds, tests and deploys the app.",
        date: "2025-02-03",
        category: "DevOps",
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Create REST API Documentation",
        description: "Write API docs using Swagger. Implement API documentation that includes endpoints, methods, parameters, responses and examples.",
        date: "2025-02-04",
        category: "Backend",
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Develop New Landing Page",
        description: "Design and implement the landing page UI. Implement the UI using React and CSS.",
        date: "2025-02-05",
        category: "UI/UX",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Migrate Database to PostgreSQL",
        description: "Switch from MySQL to PostgreSQL for scalability. Implement the database migration script.",
        date: "2025-02-06",
        category: "Database",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Implement WebSockets",
        description: "Enable real-time updates using WebSockets. Implement the WebSocket server and client.",
        date: "2025-02-07",
        category: "Backend",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Create AI-based Search Feature",
        description: "Use NLP to enhance search results. Implement the AI-based search feature.",
        date: "2025-02-08",
        category: "AI",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Set Up Load Balancer",
        description: "Distribute traffic with Nginx load balancer. Implement the load balancer configuration.",
        date: "2025-02-09",
        category: "DevOps",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Enhance Mobile Responsiveness",
        description: "Fix UI issues for mobile users. Implement responsive design for mobile devices.",
        date: "2025-02-10",
        category: "UI/UX",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Fix Memory Leak in Backend",
        description: "Optimized memory allocation in Node.js app. Fixed memory leak in backend.",
        date: "2025-01-28",
        category: "Backend",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Setup Jest for Unit Testing",
        description: "Configured Jest and wrote initial test cases. Implemented unit testing for the app.",
        date: "2025-01-29",
        category: "Testing",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Implemented Dark Mode",
        description: "Added dark mode toggle to settings. Implemented dark mode.",
        date: "2025-01-30",
        category: "Frontend",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Refactored Codebase",
        description: "Cleaned up old code and removed redundancies. Refactored codebase.",
        date: "2025-01-31",
        category: "Development",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Deployed App to AWS",
        description: "Set up EC2 instances and deployed app. Implemented continuous deployment to AWS.",
        date: "2025-02-01",
        category: "Cloud",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Fix 500 Error in API",
        description: "Investigate and resolve server error. Fix 500 error in API.",
        date: "2025-02-11",
        category: "Backend",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Resolve Login Authentication Bug",
        description: "Fix incorrect password validation issue. Resolve login authentication bug.",
        date: "2025-02-12",
        category: "Security",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Slow Page Load Issue",
        description: "Optimize assets and reduce render blocking. Fix slow page load issue.",
        date: "2025-02-13",
        category: "Frontend",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Data Loss in Transactions",
        description: "Investigate database rollback failures. Fix data loss in transactions.",
        date: "2025-02-14",
        category: "Database",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Security Vulnerability in OAuth",
        description: "Patch OAuth flow to prevent token leakage. Fix security vulnerability in OAuth.",
        date: "2025-02-15",
        category: "Security",
      },
    ],
    taskNumbers: {
      active: 5,
      newTask: 5,
      completed: 5,
      failed: 5,
    },
  },

  {
    id: 4,
    email: "rishi@employee.com",
    password: "456",
    firstname: "Rishi",
    tasks: [
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Develop API Rate Limiting",
        description: "Implement rate limiting to prevent abuse. Configure API keys and set up rate limits and burst limits to prevent excessive requests.",
        date: "2025-02-16",
        category: "Backend",
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Enhance Search Algorithm",
        description: "Improve search ranking logic for better results. Use machine learning to improve search relevance and reduce no-results pages.",
        date: "2025-02-17",
        category: "AI",
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Implement OAuth 2.0",
        description: "Enable secure third-party authentication. Implement OAuth 2.0 protocol to allow users to authenticate using other services.",
        date: "2025-02-18",
        category: "Security",
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Optimize CSS for Performance",
        description: "Reduce unused styles and improve rendering. Optimize CSS for better page performance by reducing unused styles.",
        date: "2025-02-19",
        category: "Frontend",
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Implement CI/CD Pipeline",
        description: "Automate deployment with GitHub Actions. Set up CI/CD pipeline to automate testing and deployment for faster iteration.",
        date: "2025-02-20",
        category: "DevOps",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Integrate AI Image Recognition",
        description: "Use TensorFlow.js for image analysis. Integrate AI image recognition to enable image analysis and object detection.",
        date: "2025-02-21",
        category: "AI",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Migrate Backend to NestJS",
        description: "Refactor Express app to NestJS for scalability. Migrate the backend to NestJS for better scalability and performance.",
        date: "2025-02-22",
        category: "Backend",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Enhance Dark Mode Contrast",
        description: "Improve accessibility in low-light mode. Enhance dark mode contrast to improve accessibility for users with low vision.",
        date: "2025-02-23",
        category: "UI/UX",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Add Push Notifications",
        description: "Integrate Firebase for real-time notifications. Add push notifications to enable real-time notifications for users.",
        date: "2025-02-24",
        category: "Mobile",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Refactor Redux Store",
        description: "Improve state management efficiency. Refactor Redux store to improve state management efficiency and reduce boilerplate code.",
        date: "2025-02-25",
        category: "Frontend",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Enable Multi-Tenant Support",
        description: "Modify architecture to support multiple clients. Enable multi-tenant support to allow multiple clients to share the same infrastructure.",
        date: "2025-02-10",
        category: "Backend",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Optimize SQL Queries",
        description: "Reduce load time with query optimization. Optimize SQL queries to reduce load time and improve performance.",
        date: "2025-02-11",
        category: "Database",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Configure Load Balancer",
        description: "Distribute traffic efficiently across servers. Configure load balancer to distribute traffic efficiently across servers.",
        date: "2025-02-12",
        category: "Cloud",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Upgrade Node.js Version",
        description: "Ensure compatibility with latest features. Upgrade Node.js version to ensure compatibility with latest features.",
        date: "2025-02-13",
        category: "Backend",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Automate Security Patching",
        description: "Set up auto-updates for security patches. Automate security patching to ensure timely updates of security patches.",
        date: "2025-02-14",
        category: "Security",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Resolve Memory Leak in Backend",
        description: "Debug high memory usage in microservices. Debug high memory usage in microservices to identify and fix memory leaks.",
        date: "2025-02-26",
        category: "Backend",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Fix Responsiveness in iOS App",
        description: "Ensure UI elements scale properly. Fix responsiveness in iOS app to ensure UI elements scale properly.",
        date: "2025-02-27",
        category: "Mobile",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Investigate Slow Caching Performance",
        description: "Check Redis configuration for bottlenecks. Investigate slow caching performance to identify bottlenecks in Redis configuration.",
        date: "2025-02-28",
        category: "Database",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Fix Broken WebSockets",
        description: "Reconnect strategy for persistent connections. Fix broken WebSockets to ensure persistent connections.",
        date: "2025-02-29",
        category: "Backend",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Improve Lighthouse Score",
        description: "Optimize for better Core Web Vitals. Improve Lighthouse score by optimizing for better Core Web Vitals.",
        date: "2025-03-01",
        category: "Frontend",
      },
    ],
    taskNumbers: {
      active: 5,
      newTask: 5,
      completed: 5,
      failed: 5,
    },
  },

  {
    id: 5,
    email: "nayana@employee.com",
    password: "456",
    firstname: "Nayana",
    tasks: [
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Write Technical Debt Documentation",
        description: "Write documentation for technical debt. Write technical debt documentation to communicate to team members.",
        date: "2025-01-10",
        category: "Documentation",
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Fix Broken CSS",
        description: "Fix CSS error causing layout issues. Fix broken CSS to improve UI.",
        date: "2025-01-11",
        category: "Frontend",
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Improve Code Readability",
        description: "Refactor code for better readability. Improve code readability to make it easier for developers to understand.",
        date: "2025-01-12",
        category: "Development",
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Write Unit Tests for API",
        description: "Write unit tests for API endpoints. Write unit tests for API to catch bugs.",
        date: "2025-01-13",
        category: "Backend",
      },
      {
        active: true,
        newTask: false,
        completed: false,
        failed: false,
        title: "Fix Database Connection Issue",
        description: "Resolve database connection issue. Fix database connection issue to prevent data loss.",
        date: "2025-01-14",
        category: "Database",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Fix Memory Leak in Frontend",
        description: "Fix memory leak in frontend. Fix memory leak in frontend to prevent performance issues.",
        date: "2025-01-15",
        category: "Frontend",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Add Authentication to API",
        description: "Add authentication to API endpoints. Add authentication to API to prevent unauthorized access.",
        date: "2025-01-16",
        category: "Backend",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Improve Code Quality",
        description: "Improve code quality. Improve code quality to make it more maintainable.",
        date: "2025-01-17",
        category: "Development",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Write Integration Tests for API",
        description: "Write integration tests for API endpoints. Write integration tests for API to catch bugs.",
        date: "2025-01-18",
        category: "Backend",
      },
      {
        active: false,
        newTask: true,
        completed: false,
        failed: false,
        title: "Improve UI/UX",
        description: "Improve UI/UX. Improve UI/UX to make it more user-friendly.",
        date: "2025-01-19",
        category: "Frontend",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Fix Critical Bug",
        description: "Fix critical bug causing app to crash. Fix critical bug to prevent app crashes.",
        date: "2025-01-20",
        category: "Development",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Improve Page Load Speed",
        description: "Optimize assets and reduce render blocking. Improve page load speed by optimizing assets and reducing render blocking.",
        date: "2025-01-21",
        category: "Performance",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Improve Error Handling",
        description: "Improve error handling. Improve error handling to make it more robust.",
        date: "2025-01-22",
        category: "Development",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Improve Code Quality",
        description: "Improve code quality. Improve code quality to make it more maintainable.",
        date: "2025-01-23",
        category: "Development",
      },
      {
        active: false,
        newTask: false,
        completed: true,
        failed: false,
        title: "Improve UI/UX",
        description: "Improve UI/UX. Improve UI/UX to make it more user-friendly.",
        date: "2025-01-24",
        category: "Frontend",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Fix Broken Unit Tests",
        description: "Fix broken unit tests. Fix broken unit tests to catch bugs.",
        date: "2025-01-25",
        category: "Backend",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Fix Database Connection Issue",
        description: "Resolve database connection issue. Fix database connection issue to prevent data loss.",
        date: "2025-01-26",
        category: "Database",
      },
      {
        active: false,
        newTask: false,
        completed: false,
        failed: true,
        title: "Improve Code Readability",
        description: "Refactor code for better readability. Improve code readability to make it easier for developers to understand.",
        date: "2025-01-27",
        category: "Development",
      },
    ],
    taskNumbers: {
      active: 5,
      newTask: 5,
      completed: 5,
      failed: 5,
    },
  }


  
];

const admin = {
  id: 1,
  email: "admin@example.com",
  password: "123",
  firstname: "Admin",
};

export const setLocalStorage = () => {
  localStorage.setItem("employees", JSON.stringify(employees));
  localStorage.setItem("admin", JSON.stringify(admin));
};

export const getLocalStorage = () => {
  const employees = JSON.parse(localStorage.getItem("employees"));
  const admin = JSON.parse(localStorage.getItem("admin"));

  return { employees, admin };
};


