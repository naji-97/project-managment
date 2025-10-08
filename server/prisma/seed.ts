import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function deleteAllData() {
  console.log("🗑️  Clearing all data...");
  
  // Disable foreign key checks (PostgreSQL)
  await prisma.$executeRaw`SET session_replication_role = 'replica';`;

  const deletionOrder = [
    "taskAssignment",
    "attachment", 
    "comment",
    "task",
    "projectTeam",
    "project",
    "team",
    "user",
    "session",
    "account",
    "verification"
  ];

  for (const modelName of deletionOrder) {
    const capitalizedModelName = modelName.charAt(0).toUpperCase() + modelName.slice(1);
    const model: any = prisma[capitalizedModelName as keyof typeof prisma];
    
    if (model && typeof model.deleteMany === 'function') {
      try {
        await model.deleteMany({});
        console.log(`✅ Cleared data from ${capitalizedModelName}`);
      } catch (error) {
        console.error(`❌ Error clearing data from ${capitalizedModelName}:`, error);
      }
    }
  }

  // Re-enable foreign key checks
  await prisma.$executeRaw`SET session_replication_role = 'origin';`;
  console.log("✅ All data cleared successfully");
}

async function main() {
  const dataDirectory = path.join(process.cwd(),"prisma", "seedData");

  await deleteAllData();

  // PHASE 1: Create base records (no foreign key dependencies)
  console.log("\n📦 PHASE 1: Creating base records...");
  
  // First, create teams and projects (they don't depend on anything)
  const teamData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "team.json"), "utf-8"));
  const projectData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "project.json"), "utf-8"));
  
  await prisma.team.createMany({ data: teamData });
  console.log(`✅ Created ${teamData.length} teams`);
  
  await prisma.project.createMany({ data: projectData });
  console.log(`✅ Created ${projectData.length} projects`);

  // PHASE 2: Create users without team relationships
  console.log("\n👥 PHASE 2: Creating users...");
  
  const userData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "user.json"), "utf-8"));
  
  // Create users without teamId first
  const usersWithoutTeam = userData.map((user: any) => {
    const { teamId, ...userWithoutTeam } = user;
    return userWithoutTeam;
  });
  
  await prisma.user.createMany({ data: usersWithoutTeam });
  console.log(`✅ Created ${usersWithoutTeam.length} users (without teams)`);

  // PHASE 3: Create tasks (they depend on users and projects)
  console.log("\n📝 PHASE 3: Creating tasks...");
  
  const taskData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "task.json"), "utf-8"));
  
  // Verify that all referenced users and projects exist
  const existingUsers = await prisma.user.findMany({ select: { id: true } });
  const existingProjects = await prisma.project.findMany({ select: { id: true } });
  
  const existingUserIds = existingUsers.map(u => u.id);
  const existingProjectIds = existingProjects.map(p => p.id);
  
  const validTasks = taskData.filter((task: any) => 
    existingUserIds.includes(task.authorUserId) && 
    existingProjectIds.includes(task.projectId) &&
    (!task.assignedUserId || existingUserIds.includes(task.assignedUserId))
  );
  
  if (validTasks.length !== taskData.length) {
    console.warn(`⚠️  Filtered out ${taskData.length - validTasks.length} tasks with invalid references`);
  }
  
  await prisma.task.createMany({ data: validTasks });
  console.log(`✅ Created ${validTasks.length} tasks`);

  // PHASE 4: Create project teams (depend on teams and projects)
  console.log("\n🔗 PHASE 4: Creating project teams...");
  
  const projectTeamData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "projectTeam.json"), "utf-8"));
  
  const validProjectTeams = projectTeamData.filter((pt: any) => 
    existingProjectIds.includes(pt.projectId) && 
    teamData.some((team: any) => team.id === pt.teamId)
  );
  
  if (validProjectTeams.length !== projectTeamData.length) {
    console.warn(`⚠️  Filtered out ${projectTeamData.length - validProjectTeams.length} project teams with invalid references`);
  }
  
  await prisma.projectTeam.createMany({ data: validProjectTeams });
  console.log(`✅ Created ${validProjectTeams.length} project teams`);

  // PHASE 5: Update users with team relationships
  console.log("\n🔄 PHASE 5: Updating user teams...");
  
  let updatedUsers = 0;
  for (const user of userData) {
    if (user.teamId) {
      // Verify the team exists
      const teamExists = teamData.some((team: any) => team.id === user.teamId);
      if (teamExists) {
        await prisma.user.update({
          where: { id: user.id },
          data: { teamId: user.teamId }
        });
        updatedUsers++;
      }
    }
  }
  console.log(`✅ Updated ${updatedUsers} users with team assignments`);

  // PHASE 6: Create task assignments (depend on users and tasks)
  console.log("\n📋 PHASE 6: Creating task assignments...");
  
  const taskAssignmentData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "taskAssignment.json"), "utf-8"));
  const existingTasks = await prisma.task.findMany({ select: { id: true } });
  const existingTaskIds = existingTasks.map(t => t.id);
  
  const validTaskAssignments = taskAssignmentData.filter((ta: any) => 
    existingUserIds.includes(ta.userId) && 
    existingTaskIds.includes(ta.taskId)
  );
  
  if (validTaskAssignments.length !== taskAssignmentData.length) {
    console.warn(`⚠️  Filtered out ${taskAssignmentData.length - validTaskAssignments.length} task assignments with invalid references`);
  }
  
  await prisma.taskAssignment.createMany({ data: validTaskAssignments });
  console.log(`✅ Created ${validTaskAssignments.length} task assignments`);

  // PHASE 7: Create attachments and comments (depend on users and tasks)
  console.log("\n📎 PHASE 7: Creating attachments and comments...");
  
  const attachmentData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "attachment.json"), "utf-8"));
  const commentData = JSON.parse(fs.readFileSync(path.join(dataDirectory, "comment.json"), "utf-8"));
  
  const validAttachments = attachmentData.filter((att: any) => 
    existingUserIds.includes(att.uploadedById) && 
    existingTaskIds.includes(att.taskId)
  );
  
  const validComments = commentData.filter((comment: any) => 
    existingUserIds.includes(comment.userId) && 
    existingTaskIds.includes(comment.taskId)
  );
  
  if (validAttachments.length !== attachmentData.length) {
    console.warn(`⚠️  Filtered out ${attachmentData.length - validAttachments.length} attachments with invalid references`);
  }
  
  if (validComments.length !== commentData.length) {
    console.warn(`⚠️  Filtered out ${commentData.length - validComments.length} comments with invalid references`);
  }
  
  await prisma.attachment.createMany({ data: validAttachments });
  await prisma.comment.createMany({ data: validComments });
  
  console.log(`✅ Created ${validAttachments.length} attachments`);
  console.log(`✅ Created ${validComments.length} comments`);

  console.log("\n🎉 Database seeded successfully!");
  console.log("Summary:");
  console.log(`- Teams: ${teamData.length}`);
  console.log(`- Projects: ${projectData.length}`);
  console.log(`- Users: ${usersWithoutTeam.length}`);
  console.log(`- Tasks: ${validTasks.length}`);
  console.log(`- Project Teams: ${validProjectTeams.length}`);
  console.log(`- Task Assignments: ${validTaskAssignments.length}`);
  console.log(`- Attachments: ${validAttachments.length}`);
  console.log(`- Comments: ${validComments.length}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });