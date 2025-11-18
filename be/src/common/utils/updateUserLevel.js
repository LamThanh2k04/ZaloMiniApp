import prisma from "../prisma/initPrisma.js";

export const updateUserLevel = async(userId) => {
 const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
  const levels = await prisma.membershipLevel.findMany();

  const matchedLevel = levels.find(
    (lvl) =>
      user.totalPoints >= lvl.minPoints &&
      (lvl.maxPoints === null || user.totalPoints <= lvl.maxPoints)
  );

  if (matchedLevel && user.levelId !== matchedLevel.id) {
    await prisma.user.update({
      where: { id: userId },
      data: { levelId: matchedLevel.id },
    });
  }
}