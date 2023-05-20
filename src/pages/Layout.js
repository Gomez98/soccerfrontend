import { Outlet, Link } from "react-router-dom";
import '../css/layout.css'
const Layout = () => {
    return (
        <div>
            <nav className="nav-soccer">
                <ul className="nav-soccer-list">
                    <li className="nav-soccer-item"><Link to="/" className="nav-soccer-link">Home</Link></li>
                    <li className="nav-soccer-item"><Link to="/about" className="nav-soccer-link">About</Link></li>
                    <li className="nav-soccer-item"><Link to="/student" className="nav-soccer-link">Student</Link></li>
                    <li className="nav-soccer-item"><Link to="/representative" className="nav-soccer-link">Representative</Link></li>
                </ul>
            </nav>
            <Outlet />
        </div>
    )
};

export default Layout;