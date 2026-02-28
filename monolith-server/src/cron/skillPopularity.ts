// skillPopularity.ts
import prisma from '../config/prisma.js';

export const updateSkillPopularity = async () => {
  console.log('Running daily skill popularity update...');
  const skills = await prisma.skill.findMany();
  for (const skill of skills) {
    const popularity = await prisma.skillOnUser.count({
      where: { skillId: skill.id },
    });
    await prisma.skill.update({
      where: { id: skill.id },
      data: { popularity },
    });
  }
  console.log('✅ Skill popularity updated');
};
