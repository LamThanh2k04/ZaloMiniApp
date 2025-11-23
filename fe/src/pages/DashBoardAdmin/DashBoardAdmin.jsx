import React from 'react'
import MenuAdmin from '../../components/SideBarMenu/MenuAdmin'
import { Outlet } from "react-router-dom";

function DashBoardAdmin() {
    return (
        <div className='flex min-h-screen'>
            <div className='w-[260px] bg-white shadow-sm'>
                <MenuAdmin />
            </div>
            <div className='flex-1 p-6 bg-gray-50'>
                <Outlet />
            </div>
        </div>
    )
}

export default DashBoardAdmin