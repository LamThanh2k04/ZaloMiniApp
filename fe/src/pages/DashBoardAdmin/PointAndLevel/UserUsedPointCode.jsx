import React, { useEffect } from 'react'
import { getAllUserUsedPointCode } from '../../../common/api/admin/pointcodeService';

function UserUsedPointCode() {
    const fetchAllUserUsedPointCode = async () => {
        try {
            const res = await getAllUserUsedPointCode();
            console.log("Lấy danh sách người dùng sử dụng mã code: ", res);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchAllUserUsedPointCode();
    }, [])
    return (
        <div>UserUsedPointCode</div>
    )
}

export default UserUsedPointCode