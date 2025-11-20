import { BadrequestException, ConflictException } from "../common/helpers/exception.helper.js"
import prisma from "../common/prisma/initPrisma.js"
import { updateUserLevel } from "../common/utils/updateUserLevel.js"

export const userZaloService = {
    getInfoUserZalo: async (userZaloId) => {
        const userZalo = await prisma.user.findUnique({
            where: { id: Number(userZaloId) },
            include : {
            level : true
            }
        })
        return {
            userZalo
        }
    },
    updateUserZalo: async (userZaloId, data, avatarPath) => {
        const { name, phone, birthDate, gender, address, email } = data
        const updateData = {}
        if (name) updateData.name = String(name)
        if (email) updateData.email = String(email)
        if (phone) {
            if (!/^\d{10}$/.test(phoneNumber)) {
                throw new BadrequestException("Số điện thoại phải có 10 số. Vui lòng nhập lại.");
            }
            updateData.phone = String(phone)
        }
        if (birthDate) updateData.birthDate = new Date(birthDate)
        if (avatarPath) updateData.avatar = avatarPath
        if (gender) updateData.gender = String(gender)
        if (address) updateData.address = String(address)

        const updateUserZalo = await prisma.user.update({
            where: { id: Number(userZaloId) },
            data: updateData
        })
        return {
            updateUserZalo
        }
    },
    redeemCode: async (userId, data) => {
        const { code } = data;
        const pointCode = await prisma.pointCode.findUnique({ where: { code } });

        if (!pointCode || !pointCode.isActive) throw new BadrequestException("Mã code không hợp lệ hoặc đã bị vô hiệu hóa");
        if (pointCode.expiredAt && new Date() > pointCode.expiredAt) throw new BadrequestException("Mã đã hết hạn");

        const usedCount = await prisma.userPointCode.count({ where: { userId: Number(userId), pointCodeId: pointCode.id } });
        if (pointCode.perUserLimit && usedCount >= pointCode.perUserLimit) throw new BadrequestException("Bạn đã sử dụng mã này quá số lần cho phép");
        if (pointCode.maxUses && pointCode.usedCount >= pointCode.maxUses) throw new BadrequestException("Mã này đã được sử dụng hết lượt");

        await prisma.user.update({ where: { id: Number(userId) }, data: { totalPoints: { increment: pointCode.points } } });
        await prisma.transaction.create({ data: { userId: Number(userId), storeId: null, points: pointCode.points, type: "add" } });
        await prisma.userPointCode.create({ data: { userId: Number(userId), pointCodeId: pointCode.id } });
        await prisma.pointCode.update({ where: { id: pointCode.id }, data: { usedCount: { increment: 1 } } });

        await updateUserLevel(Number(userId));
    },
    // getUserTransactions: async (userId) => {
    //     const transactions = await prisma.transaction.findMany({
    //         where: { userId: Number(userId) },
    //         include: {
    //             store: {
    //                 select: {
    //                     name: true
    //                 }
    //             }
    //         },
    //         orderBy: {
    //             createdAt: "desc"
    //         }
    //     })
    //     return {
    //         transactions
    //     }
    // },
    listRewardsByStoreId: async (storeId) => {
        const rewards = await prisma.reward.findMany({
            where: {storeId : Number(storeId)}
        })
        return {
            rewards
        }
    },
    listRewardIsGlobal : async () => {
        const rewards = await prisma.reward.findMany({
            where : {isGlobal : true}
        })
        return {
            rewards
        }
    },
    redeemReward: async (userId, rewardId) => {
        const reward = await prisma.reward.findUnique({ where: { id: Number(rewardId) } });
        const user = await prisma.user.findUnique({ where: { id: Number(userId) } });

        if (!reward) throw new BadrequestException("Không tìm thấy phần thưởng");
        if (reward.expiredAt && new Date() > reward.expiredAt) throw new BadrequestException("Phần thưởng đã hết hạn");
        if (user.totalPoints < reward.pointsNeeded) throw new BadrequestException("Bạn không đủ điểm đổi phần thưởng này");

        await prisma.$transaction(async (tx) => {
            // Trừ điểm user
            await tx.user.update({
                where: { id: Number(userId) },
                data: { totalPoints: { decrement: reward.pointsNeeded } }
            });

            // Tạo voucher
            await tx.userVoucher.create({
                data: {
                    userId,
                    rewardId,
                    status: "unused"
                }
            });

            // Tạo record giao dịch
            await tx.transaction.create({
                data: {
                    userId,
                    storeId: reward.storeId || null, // nếu global reward, có thể để storeId = 0 hoặc nullable
                    points: reward.pointsNeeded,
                    type: "subtract"
                }
            });
        });

        // Cập nhật level user
        await updateUserLevel(userId);
    },
    registerPartnerRequest: async (userId, data) => {
        const { fullName, phone, email, address } = data

        const existing = await prisma.partnerRequest.findUnique({
            where: { userId: Number(userId) }
        });

        if (existing) {
            throw new ConflictException("Bạn đã gửi yêu cầu thành đối tác rồi")
        }
        const partnerRequest = await prisma.partnerRequest.create({
            data: {
                userId: Number(userId),
                fullName: String(fullName),
                phone: String(phone),
                email: String(email),
                address: String(address)
            }
        })
        return {
            partnerRequest
        }
    },
    updateAllUsersLevelsOptimized: async () => {
        try {
            const levels = await prisma.membershipLevel.findMany({
                orderBy: { minPoints: "asc" },
            });

            for (const level of levels) {
                let sql = `
        UPDATE User
        SET levelId = ${level.id}
        WHERE totalPoints >= ${level.minPoints}
      `;

                if (level.maxPoints !== null) {
                    sql += ` AND totalPoints <= ${level.maxPoints}`;
                }

                await prisma.$executeRawUnsafe(sql);
            }

            console.log("Tất cả users đã được cập nhật level.");
        } catch (error) {
            console.error("Lỗi không cập nhật user:", error);
        }
    },
    // getHistoryPointsUsed: async (userId) => {
    //     const usedHistory = await prisma.transaction.findMany({
    //         where: {
    //             userId: userId,
    //             points: { lt: 0 }
    //         },
    //         orderBy: { createdAt: 'desc' }
    //     })

    //     const totalPointsUsed = await prisma.transaction.aggregate({
    //         _sum: {
    //             points: true
    //         },
    //         where: {
    //             userId: userId,
    //             points: { lt: 0 }
    //         }
    //     })
    //     const pointsUsed = Math.abs(totalPointsUsed._sum.points || 0)
    //     return {
    //         usedHistory,
    //         pointsUsed
    //     }

    // },
    getAllRewardsUser: async (userId, status, page) => {
        const limit = 5
        const skip = (page - 1) * limit
        const whereCondition = {
            userId: Number(userId),
            ...(status && status !== "all" && status.trim() !== "" ? { status } : {})

        }
        const allReward = await prisma.userVoucher.findMany({
            take: limit,
            skip: skip,
            where: whereCondition,
            include: {
                reward: {
                    include: {
                        store: true
                    }
                },

            }
        })
        const total = await prisma.userVoucher.count({
            where: whereCondition
        })
        return {
            allReward,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPage: Math.ceil(total / limit)
            }
        }
    },
    getInfoRewardUser: async (userId, rewardId) => {
        const reward = await prisma.userVoucher.findFirst({
            where: {
                id: Number(rewardId),
                userId: Number(userId)
            },
            include: {
                reward: {
                    include: { store: true }
                }
            }
        });

        if (!reward) {
            throw new NotFoundException("Reward không tồn tại hoặc không thuộc user này");
        }

        return { reward };
    },

    getUserTransactionSummary: async (userId, status) => {
        const where = { userId: Number(userId) };

        if (status === "used") {
            where.points = { lt: 0 };
        } else if (status === "earned") {
            where.points = { gt: 0 };
        } else {
            throw new BadrequestException("Loại giao dịch không hợp lệ. Chỉ chấp nhận 'used' hoặc 'earned'.");
        }

        const transactions = await prisma.transaction.findMany({
            where,
            include: {
                store: { select: { name: true } }
            },
            orderBy: { createdAt: "desc" }
        });

        const totalPoints = await prisma.transaction.aggregate({
            _sum: { points: true },
            where
        });

        const points = Math.abs(totalPoints._sum.points || 0);

        return {
            transactions,
            points
        };
    },
    getAllNotificationUser: async (userId) => {
        const notification = await prisma.notification.findMany({
            where: { userId: userId }
        })
        return {
            notification
        }
    },
    getInfoNotificationUser: async (notificationId, userId) => {
        const notification = await prisma.notification.findFirst({
            where: { id: Number(notificationId), userId: userId }
        })
        return {
            notification
        }
    },
    getAllStore: async () => {
        const stores = await prisma.store.findMany({
            where: { isActive: true, status : "approved" },
            select : {
                id : true,
                name : true,
                logo : true,
                address : true
            }
        })
        return {
            stores
        }
    }
}