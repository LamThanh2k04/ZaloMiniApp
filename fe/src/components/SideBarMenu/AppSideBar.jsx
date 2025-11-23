import React from 'react'
import MenuAdmin from './MenuAdmin'
import MenuPartner from './MenuPartner'

function AppSideBar() {
    switch (role) {
        case "admin":
            return <MenuAdmin />
        case "partner":
            return <MenuPartner />
        default:
            return null;
    }
}

export default AppSideBar