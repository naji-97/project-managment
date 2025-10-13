import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data (optional - be careful in production!)
  await prisma.verification.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.attachment.deleteMany();
  await prisma.taskAssignment.deleteMany();
  await prisma.task.deleteMany();
  await prisma.projectTeam.deleteMany();
  await prisma.project.deleteMany();
  await prisma.team.deleteMany();
  // await prisma.user.deleteMany();

  // Create Teams
  console.log('Creating teams...');
  const teams = await prisma.team.createManyAndReturn({
    data: [
      { teamName: 'Frontend Development' },
      { teamName: 'Backend Development' },
      { teamName: 'DevOps & Infrastructure' },
      { teamName: 'Quality Assurance' },
      { teamName: 'Product Management' },
    ],
  });

  // Create Users
  console.log('Creating users...');
  const users = await prisma.user.createManyAndReturn({
    data: [
      {
        id: 'user_1',
        username: 'alice_dev',
        email: 'alice@company.com',
        name: 'Alice Johnson',
        teamId: teams[0].id,
        profilePictureUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 'user_2',
        username: 'bob_backend',
        email: 'bob@company.com',
        name: 'Bob Smith',
        teamId: teams[1].id,
        profilePictureUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 'user_3',
        username: 'carol_qa',
        email: 'carol@company.com',
        name: 'Carol Davis',
        teamId: teams[3].id,
        profilePictureUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 'user_4',
        username: 'david_devops',
        email: 'david@company.com',
        name: 'David Wilson',
        teamId: teams[2].id,
        profilePictureUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      },
      {
        id: 'user_5',
        username: 'eva_pm',
        email: 'eva@company.com',
        name: 'Eva Martinez',
        teamId: teams[4].id,
        profilePictureUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      },
    ],
  });

  // Create Projects
  console.log('Creating projects...');
  const projects = await prisma.project.createManyAndReturn({
    data: [
      {
        name: 'E-commerce Platform Redesign',
        description: 'Complete redesign of our e-commerce platform with modern UI/UX and improved performance',
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-06-30'),
      },
      {
        name: 'Mobile App Development',
        description: 'Build a cross-platform mobile application for customer engagement',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-08-15'),
      },
      {
        name: 'API Microservices Migration',
        description: 'Migrate from monolithic architecture to microservices',
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-09-30'),
      },
      {
        name: 'Data Analytics Dashboard',
        description: 'Develop a comprehensive analytics dashboard for business intelligence',
        startDate: new Date('2024-01-20'),
        endDate: new Date('2024-05-30'),
      },
    ],
  });

  // Link Projects to Teams
  console.log('Linking projects to teams...');
  await prisma.projectTeam.createMany({
    data: [
      // E-commerce Platform - Multiple teams
      { projectId: projects[0].id, teamId: teams[0].id }, // Frontend
      { projectId: projects[0].id, teamId: teams[1].id }, // Backend
      { projectId: projects[0].id, teamId: teams[3].id }, // QA
      
      // Mobile App - Multiple teams
      { projectId: projects[1].id, teamId: teams[0].id }, // Frontend
      { projectId: projects[1].id, teamId: teams[1].id }, // Backend
      { projectId: projects[1].id, teamId: teams[2].id }, // DevOps
      
      // API Migration - Backend & DevOps
      { projectId: projects[2].id, teamId: teams[1].id }, // Backend
      { projectId: projects[2].id, teamId: teams[2].id }, // DevOps
      
      // Analytics Dashboard - Frontend & Backend
      { projectId: projects[3].id, teamId: teams[0].id }, // Frontend
      { projectId: projects[3].id, teamId: teams[1].id }, // Backend
    ],
  });

  // Create Tasks
  console.log('Creating tasks...');
  const tasks = await prisma.task.createManyAndReturn({
    data: [
      // E-commerce Platform Tasks
      {
        title: 'Design New Product Page',
        description: 'Create wireframes and mockups for the new product detail page',
        status: 'completed',
        priority: 'high',
        tags: 'design,ui,ux',
        startDate: new Date('2024-01-20'),
        dueDate: new Date('2024-02-15'),
        points: 5,
        projectId: projects[0].id,
        authorUserId: users[4].id, // Eva (PM)
        assignedUserId: users[0].id, // Alice (Frontend)
      },
      {
        title: 'Implement Shopping Cart',
        description: 'Develop the shopping cart functionality with add/remove items',
        status: 'in-progress',
        priority: 'high',
        tags: 'frontend,functionality',
        startDate: new Date('2024-02-01'),
        dueDate: new Date('2024-03-15'),
        points: 8,
        projectId: projects[0].id,
        authorUserId: users[4].id,
        assignedUserId: users[0].id,
      },
      {
        title: 'Payment Integration',
        description: 'Integrate Stripe payment gateway',
        status: 'todo',
        priority: 'medium',
        tags: 'backend,payments',
        startDate: new Date('2024-03-01'),
        dueDate: new Date('2024-04-10'),
        points: 13,
        projectId: projects[0].id,
        authorUserId: users[4].id,
        assignedUserId: users[1].id, // Bob (Backend)
      },

      // Mobile App Tasks
      {
        title: 'Set Up React Native Project',
        description: 'Initialize React Native project with TypeScript and navigation',
        status: 'completed',
        priority: 'high',
        tags: 'setup,mobile',
        startDate: new Date('2024-02-05'),
        dueDate: new Date('2024-02-20'),
        points: 3,
        projectId: projects[1].id,
        authorUserId: users[4].id,
        assignedUserId: users[0].id,
      },
      {
        title: 'User Authentication Flow',
        description: 'Implement login/signup screens with authentication',
        status: 'in-progress',
        priority: 'high',
        tags: 'auth,security',
        startDate: new Date('2024-02-15'),
        dueDate: new Date('2024-03-20'),
        points: 8,
        projectId: projects[1].id,
        authorUserId: users[4].id,
        assignedUserId: users[1].id,
      },

      // API Migration Tasks
      {
        title: 'Design Microservices Architecture',
        description: 'Plan the microservices structure and communication patterns',
        status: 'completed',
        priority: 'high',
        tags: 'architecture,planning',
        startDate: new Date('2024-03-05'),
        dueDate: new Date('2024-03-25'),
        points: 5,
        projectId: projects[2].id,
        authorUserId: users[4].id,
        assignedUserId: users[1].id,
      },
      {
        title: 'Containerize Services with Docker',
        description: 'Create Docker containers for each microservice',
        status: 'in-progress',
        priority: 'medium',
        tags: 'docker,devops',
        startDate: new Date('2024-03-20'),
        dueDate: new Date('2024-04-30'),
        points: 13,
        projectId: projects[2].id,
        authorUserId: users[4].id,
        assignedUserId: users[3].id, // David (DevOps)
      },
    ],
  });

  // Create Task Assignments (additional assignments)
  console.log('Creating task assignments...');
  await prisma.taskAssignment.createMany({
    data: [
      { userId: users[2].id, taskId: tasks[0].id }, // Carol assigned to design review
      { userId: users[3].id, taskId: tasks[4].id }, // David helping with auth security
    ],
  });

  // Create Comments
  console.log('Creating comments...');
  await prisma.comment.createMany({
    data: [
      {
        text: 'The initial designs look great! Can we add more product image variants?',
        taskId: tasks[0].id,
        userId: users[2].id, // Carol (QA)
      },
      {
        text: 'I\'ve started working on the cart state management. Should have a prototype by next week.',
        taskId: tasks[1].id,
        userId: users[0].id, // Alice
      },
      {
        text: 'Make sure to follow our security guidelines for the payment integration.',
        taskId: tasks[2].id,
        userId: users[3].id, // David (DevOps)
      },
    ],
  });

  // Create Attachments
  console.log('Creating attachments...');
  await prisma.attachment.createMany({
    data: [
      {
        fileURL: 'https://example.com/files/design-specs.pdf',
        fileName: 'Design Specifications.pdf',
        taskId: tasks[0].id,
        uploadedById: users[4].id, // Eva
      },
      {
        fileURL: 'https://example.com/files/api-docs.zip',
        fileName: 'API Documentation.zip',
        taskId: tasks[2].id,
        uploadedById: users[1].id, // Bob
      },
    ],
  });

  console.log('✅ Seed completed successfully!');
  console.log(`Created: ${teams.length} teams, ${users.length} users, ${projects.length} projects, ${tasks.length} tasks`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });