import React from 'react'
import MenuPartner from '../../components/SideBarMenu/MenuPartner'
import { Outlet } from 'react-router-dom';
function DashBoardPartner() {
    return (
        <div className='flex min-h-screen'>
            <div className='w-[260px] bg-white shadow-sm'>
                <MenuPartner />
            </div>
            <div className='flex-1 p-6 bg-gray-50'>
                <Outlet />
            </div>
        </div>
    )
}

export default DashBoardPartner