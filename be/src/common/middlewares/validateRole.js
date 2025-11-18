import { ForbiddenException } from "../helpers/exception.helper.js"

export const validateAdmin = (req,res,next) => {
    if(req.user.role !== "admin") {
        throw new ForbiddenException("Bạn không có quyền truy cập vào quản trị viên")
    }
    next();
}

export const validatePartner = (req,res,next) => {
    if(req.user.role !== "partner") {
        throw new ForbiddenException("Bạn không có quyền truy cập vào đối tác")
    }
    next();
}
