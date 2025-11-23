import React from 'react'
import MenuAdmin from './MenuAdmin'
import MenuPartner from './MenuPartner'
import { useSelector } from 'react-redux'

function AppSideBar() {
    const { user } = useSelector((state) => state.userSlice);
    if (user.role === "admin") {
        return <MenuAdmin />
    } else {
        return <MenuPartner />
    }
}

export default AppSideBar