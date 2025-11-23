import React, { useEffect } from 'react'
import { getAllMemberLevelService } from '../../../common/api/admin/memberService';

function MemberLevel() {
    const fetchAllMemberLevel = async () => {
        try {
            const res = await getAllMemberLevelService();
            console.log("Lấy danh sách cấp bậc: ", res);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        fetchAllMemberLevel();
    }, [])
    return (
        <div>MemberLevel</div>
    )
}

export default MemberLevel