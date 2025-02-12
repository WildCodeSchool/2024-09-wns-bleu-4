import { Outlet } from "react-router-dom"

const Layout = () => {
	return(
		<main className="main-content">
			<Outlet />
		</main>
	)
}

export default Layout