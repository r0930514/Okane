import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div className="container flex h-screen justify-center items-center">
            <Link to={'/login'}>
                <div className="btn">
                    <span>登入</span>
                </div>
            </Link>
        </div>
    )
}
export default HomePage;