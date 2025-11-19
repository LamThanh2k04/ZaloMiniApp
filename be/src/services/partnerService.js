import { BadrequestException, ConflictException, NotFoundException } from "../common/helpers/exception.helper.js"
import prisma from "../common/prisma/initPrisma.js"
import { nanoid } from "nanoid";
export const partnerService = {
    createStore: async (partnerId, data, logo) => {
        const { name, address, pointRate } = data
        if (!name || !address || !pointRate) throw new BadrequestException("Thiếu trường nào đó")
        const existing = await prisma.store.findFirst({
            where: { name: String(name) }
        })
        if (existing) throw new ConflictException("Đã có tên cửa hàng này. Vui lòng chọn cửa hàng khác")
        const store = await prisma.store.create({
            data: {
                name: String(name),
                logo: logo,
                ownerId: partnerId,
                address: String(address),
                pointRate: Number(pointRate)
            }
        })
        return {
            store
        }
    },
    updateStore: async (storeId, data, logo) => {
        const { name, address, pointRate, isActive } = data
        const updateData = {}
        const store = await prisma.store.findUnique({
            where: { id: Number(storeId) }
        })
        if (!store) throw new NotFoundException("Không thấy cửa hàng")
        if (name) updateData.name = String(name)
        if (address) updateData.address = String(address)
        if (pointRate) updateData.pointRate = Number(pointRate)
        if (logo) updateData.logo = logo
        if (typeof isActive !== "undefined") {
            updateData.isActive =
                isActive === true ||
                isActive === "true" ||
                isActive === 1 ||
                isActive === "1";
        }
        const updated = await prisma.store.update({
            where: { id: Number(storeId) },
            data: updateData
        })
        return {
            updated
        }
    },
    getAllStoresPartner: async (partnerId, keyword, page) => {
        const limit = 5
        const skip = (page - 1) * limit
        const whereCondition = {
            ownerId: partnerId,
            ...(keyword ? {
                name: {
                    contains: keyword.toLowerCase()
                }
            } : {})
        }
        const stores = await prisma.store.findMany({
            take: limit,
            skip: skip,
            where: whereCondition
        })
        const total = await prisma.store.count({
            where: whereCondition
        })
        return {
            stores,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPage: Math.ceil(total / limit)
            }
        }

    },
    getAllStoresPartnerName: async (partnerId) => {
        const stores = await prisma.store.findMany({
            where: { ownerId: partnerId , isActive : true, status : "approved"},
            select : {
                id : true,
                name : true,
                logo : true
            }
        })
        return {
            stores
        }
    },
    createRewardStore: async (data) => {
        const { name, description, quantity, expiredAt, pointsNeeded, storeId } = data
        if (!name || !description || !quantity || !expiredAt || !pointsNeeded) throw new BadrequestException("Thiếu trường nào đó")

        const existing = await prisma.reward.findFirst({
            where: { name: String(name) }
        })
        if (existing) throw new ConflictException("Tên đã tồn tại")
        const code = `RW-${nanoid(8).toUpperCase()}`;
        const rewardStore = await prisma.reward.create({
            data: {
                name: String(name),
                description: String(description),
                quantity: Number(quantity),
                expiredAt: new Date(expiredAt),
                pointsNeeded: Number(pointsNeeded),
                isGlobal: false,
                storeId: Number(storeId),
                code: code
            }
        })
        return {
            rewardStore
        }
    },
    updateRewardStore: async (rewardStoreId, data) => {
        const { name, description, pointsNeeded, quantity, expiredAt, isActive } = data
        const rewardGlobal = await prisma.reward.findUnique({
            where: { id: Number(rewardStoreId) }
        })
        if (!rewardGlobal) throw new NotFoundException("Không tìm thấy rewardGlobal")
        const updateData = {}
        if (name) updateData.name = String(name)
        if (description) updateData.description = String(description)
        if (pointsNeeded) updateData.pointsNeeded = Number(pointsNeeded)
        if (quantity) updateData.quantity = Number(quantity)
        if (expiredAt) updateData.expiredAt = new Date(expiredAt)
        if (typeof isActive !== "undefined") {
            updateData.isActive =
                isActive === true ||
                isActive === "true" ||
                isActive === 1 ||
                isActive === "1";
        }
        const updated = await prisma.reward.update({
            where: { id: Number(rewardStoreId) },
            data: updateData
        })
        return {
            updated
        }
    },
    getRewardsStore: async (partnerId, keyword, storeId, page) => {
        const limit = 10;
        const skip = (page - 1) * limit;

        // Lấy danh sách store của partner
        const storeWhere = { ownerId: partnerId };
        if (storeId) storeWhere.id = storeId;

        const stores = await prisma.store.findMany({
            where: storeWhere,
            select: { id: true, name: true },
        });
        const storeIds = stores.map(s => s.id);

        // Điều kiện filter reward
        const rewardWhere = {
            storeId: { in: storeIds },
            ...(keyword
                ? {
                    OR: [
                        { name: { contains: keyword, mode: "insensitive" } },
                        { store: { name: { contains: keyword, mode: "insensitive" } } },
                    ],
                }
                : {}),
        };

        const rewards = await prisma.reward.findMany({
            where: rewardWhere,
            skip,
            take: limit,
            include: { store: true },
        });

        const total = await prisma.reward.count({ where: rewardWhere });

        return {
            rewards,
            pagination: {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit),
            },
        };
    },
    getUserVouchersByStatus: async (partnerId, status, page) => {
        const limit = 10;
        const skip = (page - 1) * limit;


        const stores = await prisma.store.findMany({
            where: { ownerId: partnerId },
            select: { id: true }
        });
        const storeIds = stores.map(s => s.id);


        const whereCondition = {
            reward: { storeId: { in: storeIds } },
            status: status // "unused" | "used"
        };

        const userVouchers = await prisma.userVoucher.findMany({
            where: whereCondition,
            skip,
            take: limit,
            include: {
                user: true,
                reward: { include: { store: true } },
            },
        });

        const total = await prisma.userVoucher.count({ where: whereCondition });

        return {
            userVouchers,
            pagination: {
                page,
                limit,
                total,
                totalPage: Math.ceil(total / limit),
            },
        };
    },
    getTotal: async (partnerId) => {
        const stores = await prisma.store.count({
            where: { ownerId: partnerId }
        })
        const storeIds = stores.map(s => s.id);
        const totalStores = storeIds.length;
        const totalRewards = await prisma.reward.count({
            where: { storeId: { in: storeIds } }
        });
        const totalUnusedVouchers = await prisma.userVoucher.count({
            where: {
                reward: { storeId: { in: storeIds } },
                status: "unused"
            }
        });
        const totalUsedVouchers = await prisma.userVoucher.count({
            where: {
                reward: { storeId: { in: storeIds } },
                status: "used"
            }
        });
        return {
            totalStores,
            totalRewards,
            totalUnusedVouchers,
            totalUsedVouchers
        }
    },
    getTopUserPointStore: async (partnerId, storeId) => {

        // 1. Lấy danh sách store thuộc partner
        const stores = await prisma.store.findMany({
            where: { ownerId: partnerId },
            select: { id: true, name : true }
        });

        const storeIds = stores.map(s => s.id);

        // 2. Nếu truyền storeId thì check có thuộc partner không
        if (storeId) {
            storeId = Number(storeId);
            if (!storeIds.includes(storeId)) {
                throw new BadrequestException("Store không thuộc partner");
            }
        }

        // 3. Query TOP user tích điểm
        const topUsers = await prisma.transaction.groupBy({
            by: ["userId"],
            where: {
                type: "add",
                storeId: storeId ? storeId : { in: storeIds }
            },
            _sum: {
                points: true
            },
            orderBy: {
                _sum: { points: "desc" }
            },
            take: 10
        });

        // 4. Lấy info user
        const userIds = topUsers.map(u => u.userId);

        const users = await prisma.user.findMany({
            where: { id: { in: userIds } },
            select: {
                id: true,
                name: true,
                phone: true,
                avatar: true
            }
        });

        // 5. Merge lại
        const result = topUsers.map(t => ({
            userId: t.userId,
            totalPoints: t._sum.points,
            user: users.find(u => u.id === t.userId)
        }));

        return result;
    },

    getPointRevenueTimeline: async (partnerId, type, storeId, startDate, endDate) => {
        // Lấy danh sách store thuộc partner
        const stores = await prisma.store.findMany({
            where: { ownerId: partnerId },
            select: { id: true }
        });

        let storeIds = stores.map(s => s.id);

        // Nếu chọn 1 store
        if (storeId) {
            storeId = Number(storeId);
            if (!storeIds.includes(storeId)) {
                throw new BadrequestException("Store không thuộc partner");
            }
            storeIds = [storeId];
        }

        // Build điều kiện thời gian
        const timeFilter = {};
        if (startDate) timeFilter.gte = new Date(startDate);
        if (endDate) timeFilter.lte = new Date(endDate);

        // Lấy transaction type 'add'
        const transactions = await prisma.transaction.findMany({
            where: {
                storeId: { in: storeIds },
                type: "add",
                ...(startDate || endDate ? { createdAt: timeFilter } : {})
            },
            select: { points: true, createdAt: true }
        });

        const timeline = {};

        transactions.forEach(t => {
            const date = new Date(t.createdAt);
            let key;

            if (type === "day") {
                key = date.toISOString().split("T")[0]; // YYYY-MM-DD
            }
            else if (type === "week") {
                const oneJan = new Date(date.getFullYear(), 0, 1);
                const week = Math.ceil((((date - oneJan) / 86400000) + oneJan.getDay() + 1) / 7);
                key = `${date.getFullYear()}-W${week}`;
            }
            else if (type === "month") {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            }
            else {
                throw new BadrequestException("type phải là: day | week | month");
            }

            timeline[key] = (timeline[key] || 0) + t.points;
        });

        return Object.keys(timeline)
            .sort()
            .map(key => ({
                date: key,
                totalPoints: timeline[key]
            }));
    }



}