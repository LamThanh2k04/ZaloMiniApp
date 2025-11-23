import { BadrequestException, ConflictException, NotFoundException } from "../common/helpers/exception.helper.js";
import prisma from "../common/prisma/initPrisma.js";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";
import {
    startOfDay, endOfDay,
    startOfWeek, endOfWeek,
    startOfMonth, endOfMonth
} from "date-fns";
export const adminService = {
    getAllUSerZalo: async (keyword, page) => {
        const limit = 5;
        const skip = (page - 1) * limit
        const whereCondition = {
            ...(keyword && {
                OR: [
                    {
                        name: {
                            contains: keyword.toLowerCase()
                        }
                    },
                    {
                        phone: {
                            contains: keyword.toLowerCase()
                        }
                    },
                    {
                        email: {
                            contains: keyword.toLowerCase()
                        }
                    }
                ]
            })
        }

        const users = await prisma.user.findMany({
            take: limit,
            skip: skip,
            where: whereCondition,
            orderBy: {
                createdAt: "desc"
            }
        })
        const total = await prisma.user.count({
            where: whereCondition
        })
        return {
            users,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPage: Math.ceil(total / limit)
            }
        }
    },
    updateUserZaloActive: async (userId, data) => {
        const { isActive } = data
        const updateData = {}
        const user = await prisma.user.findUnique({
            where: { id: Number(userId) }
        })
        if (!user) throw new NotFoundException("Không tìm thấy người dùng")
        if (typeof isActive !== "undefined") {
            updateData.isActive =
                isActive === true ||
                isActive === "true" ||
                isActive === 1 ||
                isActive === "1";
        }
        const updated = await prisma.user.update({
            where: { id: Number(userId) },
            data: updateData
        })
        return {
            updated
        }
    },
    updatePartnerActive: async (partnerId, data) => {
        const { isActive } = data
        const updateData = {}
        const user = await prisma.partner.findUnique({
            where: { id: Number(partnerId) }
        })
        if (!user) throw new NotFoundException("Không tìm thấy người dùng")
        if (typeof isActive !== "undefined") {
            updateData.isActive =
                isActive === true ||
                isActive === "true" ||
                isActive === 1 ||
                isActive === "1";
        }
        const updated = await prisma.partner.update({
            where: { id: Number(partnerId) },
            data: updateData
        })
        return {
            updated
        }
    },
    getAllPartnerRequest: async (status, page) => {
        const limit = 5
        const skip = (page - 1) * limit
        let whereCondition = {}
        if (status && status !== "all") {
            whereCondition.status = status; // status = "pending" | "approved" | "rejected"
        }
        const allPartnerRequest = await prisma.partnerRequest.findMany({
            take: limit,
            skip: skip,
            where: whereCondition,
            include: {
                user: true,
                adminReviewer: true
            },
            orderBy: { createdAt: "desc" }
        })
        const total = await prisma.partnerRequest.count({
            where: whereCondition
        })
        return {
            allPartnerRequest,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPage: Math.ceil(total / limit)
            }
        }
    },
    getAllStoreRequest: async (status, page) => {
        const limit = 5
        const skip = (page - 1) * limit
        let whereCondition = {}
        if (status && status !== "all") {
            whereCondition.status = status;
        }
        const allStoreRequest = await prisma.store.findMany({
            take: limit,
            skip: skip,
            where: whereCondition,
            include: {
                adminApprover: true
            },
            orderBy: { createdAt: "desc" }
        })
        const total = await prisma.store.count({
            where: whereCondition
        })
        return {
            allStoreRequest,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPage: Math.ceil(total / limit)
            }
        }
    },
    approvePartnerRequest: async (requestId, adminId) => {
        const request = await prisma.partnerRequest.findUnique({
            where: { id: Number(requestId) }
        });

        if (!request) throw new NotFoundException("Không tìm thấy yêu cầu đối tác");

        const tempPassword = Math.random().toString(36).slice(-8);
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        const partner = await prisma.partner.create({
            data: {
                userId: request.userId,
                name: request.fullName,
                phone: request.phone,
                password: hashedPassword,
                isActive: true
            }
        });

        await prisma.partnerRequest.update({
            where: { id: Number(requestId) },
            data: {
                status: "approved",
                reviewedAt: new Date(),
                reviewedById: adminId
            }
        });

        await prisma.notification.create({
            data: {
                userId: request.userId,
                title: "Duyệt thành công. Bạn đã trở thành đối tác",
                message: `Thông tin đăng nhập: 
                      phone: ${request.phone} 
                      password: ${tempPassword}`,
                type: "system",
            }
        });

        return { partner, tempPassword };
    }
    ,
    rejectPartnerRequest: async (requestId, adminId) => {
        const request = await prisma.partnerRequest.findUnique({
            where: { id: Number(requestId) }
        });

        if (!request) {
            throw new NotFoundException("Không tìm thấy yêu cầu đối tác");
        }

        await prisma.partnerRequest.update({
            where: { id: Number(requestId) },
            data: {
                status: "rejected",
                reviewedAt: new Date(),
                reviewedById: adminId
            }
        });

        // tạo notification chỉ khi request tồn tại
        await prisma.notification.create({
            data: {
                userId: request.userId,
                title: "Yêu cầu đối tác bị từ chối",
                message: `Xin lỗi ${request.fullName}, yêu cầu trở thành đối tác của bạn đã bị từ chối. Vui lòng kiểm tra lại thông tin và gửi lại yêu cầu nếu cần.`,
                type: "system",
            },
        });

    },

    approveStoreRequest: async (storeId, adminId) => {
        const store = await prisma.store.findUnique({
            where: { id: Number(storeId) }
        })
        if (!store) throw new NotFoundException("Không tìm thấy cửa hàng này gửi yêu cầu")

        await prisma.store.update({
            where: { id: Number(storeId) },
            data: {
                status: "approved",
                approvedAt: new Date(),
                approvedById: adminId
            }
        })
    },
    rejectStoreRequest: async (storeId, adminId) => {
        const store = await prisma.store.findUnique({
            where: { id: Number(storeId) }
        })
        if (!store) throw new NotFoundException("Không tìm thấy cửa hàng này gửi yêu cầu")
        await prisma.store.update({
            where: { id: Number(storeId) },
            data: {
                status: "rejected",
                approvedAt: new Date(),
                approvedById: adminId
            }
        })
    },
    getAllPartner: async (keyword, page) => {
        const limit = 5
        const skip = (page - 1) * limit
        const whereCondition = {
            ...(keyword && {
                OR: [
                    {
                        name: {
                            contains: keyword.toLowerCase()
                        }
                    },
                    {
                        phone: {
                            contains: keyword.toLowerCase()
                        }
                    }
                ]
            })
        }
        const partners = await prisma.partner.findMany({
            take: limit,
            skip: skip,
            where: whereCondition,
            
        })
        const total = await prisma.partner.count({
            where: whereCondition
        })
        return {
            partners,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPage: Math.ceil(total / limit)
            }
        }
    },
    getAllStoreParnter: async (keyword, page) => {
        const limit = 5;
        const skip = (page - 1) * limit
        const whereCondition = {
            ...(keyword && {
                OR: [
                    {
                        name: {
                            contains: keyword.toLowerCase()
                        }
                    },
                    {
                        address: {
                            contains: keyword.toLowerCase()
                        }
                    }
                ]
            })
        }
        const stores = await prisma.store.findMany({
            take: limit,
            skip: skip,
            where: whereCondition,
            include: {
                owner: true
            }
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
    createPointCode: async (adminId, data) => {
        const { code, description, points, maxUses, perUserLimit, expiredAt } = data
        if (!code || !points || !maxUses || !perUserLimit || !expiredAt) throw new BadrequestException("Thiếu trường nào đó")
        const existing = await prisma.pointCode.findUnique({
            where: { code: String(code) }
        })
        if (existing) throw new ConflictException("Code đã tồn tại. Vui lòng chọn tên khác")

        const pointCode = await prisma.pointCode.create({
            data: {
                code: String(code),
                description: String(description) || null,
                points: Number(points),
                maxUses: Number(maxUses),
                perUserLimit: Number(perUserLimit),
                expiredAt: new Date(expiredAt),
                createdById: adminId
            }
        })
        return {
            pointCode
        }
    },
    updatePointCode: async (pointCodeId, data) => {
        const pointCode = await prisma.pointCode.findUnique({
            where: { id: Number(pointCodeId) }
        })
        if (!pointCode) throw new NotFoundException("Không tìm thấy pointCode")
        const { maxUses, perUserLimit, description, expiredAt, isActive } = data
        const updateData = {}
        if (maxUses) updateData.maxUses = Number(maxUses)
        if (perUserLimit) updateData.perUserLimit = Number(perUserLimit)
        if (description) updateData.description = String(description)
        if (expiredAt) updateData.expiredAt = new Date(expiredAt)
        if (typeof isActive !== "undefined") {
            updateData.isActive =
                isActive === true ||
                isActive === "true" ||
                isActive === 1 ||
                isActive === "1";
        }
        const updated = await prisma.pointCode.update({
            where: { id: Number(pointCodeId) },
            data: updateData
        })
        return {
            updated
        }
    },
    getAllpointCode: async (keyword, page) => {
        const limit = 5;
        const skip = (page - 1) * limit
        const whereCondition = {
            ...(keyword ?
                {
                    code: {
                        contains: keyword.toLowerCase()
                    }
                }
                :
                {}
            )
        }
        const allPointCode = await prisma.pointCode.findMany({
            take: limit,
            skip: skip,
            where: whereCondition,
            include: {
                createdBy: {
                    select: {
                        id: true,
                        username: true
                    }
                }
            }
        })
        const total = await prisma.pointCode.count({
            where: whereCondition
        })
        return {
            allPointCode,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPage: Math.ceil(total / limit)
            }
        }
    },
    getAllUserUsedPointCode: async (keyword, page) => {
        const limit = 5
        const skip = (page - 1) * limit
        const whereCondition = {
            ...(keyword && {
                OR: [
                    { user: { name: { contains: keyword.toLowerCase() } } },
                    { user: { phoneNumber: { contains: Number(keyword.toLowerCase()) } } },
                    { pointCode: { code: { contains: Number(keyword.toLowerCase()) } } }
                ]

            })
        }
        const allUserUsedPointCode = await prisma.userPointCode.findMany({
            take: limit,
            skip: skip,
            where: whereCondition,
            include: {
                user: true,
                pointCode: true
            }
        })
        const total = await prisma.userPointCode.count({
            where: whereCondition
        })
        return {
            allUserUsedPointCode,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPage: Math.ceil(total / limit)
            }
        }
    },
    createMemberLevel: async (data) => {
        const { name, minPoints, maxPoints, benefits } = data
        if (!name || !minPoints || !maxPoints || !benefits) throw new BadrequestException("Thiếu trường nào đó")
        const existing = await prisma.membershipLevel.findFirst({
            where: { name: String(name) }
        })
        if (existing) throw new ConflictException("Name đã tồn tại. Vui lòng chọn tên khác")
        const memberLevel = await prisma.membershipLevel.create({
            data: {
                name: String(name),
                minPoints: Number(minPoints),
                maxPoints: Number(maxPoints),
                benefits: String(benefits)
            }
        })
        return {
            memberLevel
        }
    },
    updateMemberLevel: async (memberLevelId, data) => {
        const { name, minPoints, maxPoints, benefits } = data
        const updateData = {}
        if (name) updateData.name = String(name)
        if (minPoints) updateData.minPoints = Number(minPoints)
        if (maxPoints) updateData.maxPoints = Number(maxPoints)
        if (benefits) updateData.benefits = String(benefits)

        const memberLevel = await prisma.membershipLevel.findUnique({
            where: { id: Number(memberLevelId) }
        })
        if (!memberLevel) throw new NotFoundException("Không tìm thấy memberLevelId")
        const updated = await prisma.membershipLevel.update({
            where: { id: Number(memberLevelId) },
            data: updateData
        })
        return {
            updated
        }
    },
    getAllMemberLevel: async (keyword, page) => {
        const limit = 5
        const skip = (page - 1) * limit
        const whereCondition = {
            ...(keyword ? {
                name: {
                    contains: keyword.toLowerCase()
                }
            } : {})
        }
        const allMemberLevel = await prisma.membershipLevel.findMany({
            take: limit,
            skip: skip,
            where: whereCondition
        })
        const total = await prisma.membershipLevel.count({
            where: whereCondition
        })
        return {
            allMemberLevel,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPage: Math.ceil(total / limit)
            }
        }
    },
    createRewardGlobal: async (data) => {
        const { name, description, quantity, expiredAt, pointsNeeded } = data
        if (!name || !description || !quantity || !expiredAt || !pointsNeeded) throw new BadrequestException("Thiếu trường nào đó")

        const existing = await prisma.reward.findFirst({
            where: { name: String(name) }
        })
        if (existing) throw new ConflictException("Tên đã tồn tại")
        const code = `RW-${nanoid(8).toUpperCase()}`;
        const rewardGlobal = await prisma.reward.create({
            data: {
                name: String(name),
                description: String(description),
                quantity: Number(quantity),
                expiredAt: new Date(expiredAt),
                pointsNeeded: Number(pointsNeeded),
                isGlobal: true,
                storeId: null,
                code: code
            }
        })
        return {
            rewardGlobal
        }
    },
    updateRewardGlobal: async (rewardGlobalId, data) => {
        const { name, description, pointsNeeded, quantity, expiredAt, isActive } = data
        if(!rewardGlobalId) throw new BadrequestException("thieeu")
        const rewardGlobal = await prisma.reward.findUnique({
            where: { id: Number(rewardGlobalId) }
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
            where: { id: Number(rewardGlobalId) },
            data: updateData
        })
        return {
            updated
        }
    },
    getAllRewardGlobal: async (keyword, page) => {
        const limit = 5
        const skip = (page - 1) * limit
        const whereCondition = {
            isGlobal : true,
            ...(keyword && {
                OR: [
                    {
                        name: {
                            contains: keyword.toLowerCase()
                        }
                    },
                    {
                        code : {
                            contains: keyword.toLowerCase()
                        }
                    },
                    {
                        pointsNeeded: Number(keyword.toLowerCase())
                    }
                ]
            })
        }
        const allRewardGlobal = await prisma.reward.findMany({
            take: limit,
            skip: skip,
            where: whereCondition
        })
        const total = await prisma.reward.count({
            where: whereCondition
        })
        return {
            allRewardGlobal,
            pagination: {
                page: page,
                limit: limit,
                total: total,
                totalPage: Math.ceil(total / limit)
            }
        }
    },
    getTotal: async () => {

        const totalUsers = await prisma.user.count()
        const totalTransactions = await prisma.transaction.count()
        const totalStores = await prisma.store.count({
            where: { isActive: true }
        })
        const totalPointsIssued = await prisma.transaction.aggregate({
            _sum: {
                points: true
            },
            where: {
                points: { gt: 0 }
            }
        })
        return {
            totalUsers,
            totalTransactions,
            totalStores,
            totalPointsIssued
        }
    },
    topUsersByPoints: async () => {
        const limit = 10
        const users = await prisma.user.findMany({
            orderBy: { totalPoints: "desc" },
            take: limit,
            select: {
                id: true,
                name: true,
                avatar: true,
                phone: true,
                totalPoints: true
            }
        });

        return {
            users
        };
    },
    getMemberLevelDistribution: async () => {
        const levels = await prisma.membershipLevel.findMany({
            include: {
                _count: {
                    select: { users: true }
                }
            }
        });

        return levels.map(level => ({
            levelName: level.name,
            userCount: level._count.users
        }));
    },
    getPointLineChart: async ({ startDate, endDate, range, storeId }) => {

        let from, to;

        // 1️⃣ Nếu user chọn startDate + endDate → dùng luôn, bỏ qua range
        if (startDate && endDate) {
            from = new Date(startDate);
            to = new Date(endDate);

            if (isNaN(from) || isNaN(to)) {
                throw new BadrequestException("Invalid startDate or endDate");
            }
        }
        else {
            // 2️⃣ Nếu không có date range → dùng range
            const now = new Date();

            if (range === "day") {
                from = startOfDay(now);
                to = endOfDay(now);
            }
            else if (range === "week") {
                from = startOfWeek(now, { weekStartsOn: 1 });
                to = endOfWeek(now, { weekStartsOn: 1 });
            }
            else if (range === "month") {
                from = startOfMonth(now);
                to = endOfMonth(now);
            }
            else {
                throw new BadrequestException("range must be: day | week | month OR provide startDate & endDate");
            }
        }

        // 3️⃣ Lấy dữ liệu giao dịch điểm
        const transactions = await prisma.transaction.findMany({
            where: {
                createdAt: {
                    gte: from,
                    lte: to
                },
                ...(storeId && { storeId: Number(storeId) })
            },
            orderBy: { createdAt: "asc" }
        });

        // 4️⃣ Format dữ liệu cho biểu đồ
        const data = transactions.map(tr => ({
            date: tr.createdAt,
            points: tr.type === "add" ? tr.points : -tr.points
        }));

        return {
            startDate: from,
            endDate: to,
            total: data.reduce((sum, i) => sum + i.points, 0),
            data
        };
    },
    updateActivePointCode: async function () {
        const now = new Date()
        console.log("Đang chạy cron update - Giờ hiện tại ", now.toISOString())

        const result = await prisma.pointCode.updateMany({
            where: {
                isActive: true,
                expiredAt: { lt: now }
            },
            data: {
                isActive: false,
            }
        })
        console.log("Đã cập nhật", result.count, "Đã hết hạn mã cộng điểm")
    },
    updateActiveReward: async function () {
        const now = new Date()
        console.log("Đang chạy cron update - Giờ hiện tại ", now.toISOString())

        const result = await prisma.reward.updateMany({
            where: {
                isActive: true,
                expiredAt: { lt: now }
            },
            data: {
                isActive: false,
            }
        })
        console.log("Đã cập nhật", result.count, "Đã hết hạn phần thưởng")
    },




}