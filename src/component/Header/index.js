import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import {AiFillHome} from 'react-icons/ai'
import {FiLogOut} from 'react-icons/fi'
import {BiBriefcase} from 'react-icons/bi'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <div className="nav-bar-mobile-logo-container">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="website-logo"
            />
          </Link>

          <ul className="nav-menu-list-mobile">
            <li className="nav-menu-item">
              <Link className="nav-link" to="/">
                <AiFillHome className="nav-mobile-icon" />
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link className="nav-link" to="/jobs">
                <BiBriefcase className="nav-mobile-icon" />
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link className="nav-link" to="/login" onClick={onClickLogout}>
                <FiLogOut className="nav-mobile-icon" />
              </Link>
            </li>
          </ul>
        </div>

        <div className="nav-bar-desktop-logo-container">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="website-logo-desktop"
            />
          </Link>
          <div className="nav-bar-desktop-content-container">
            <ul className="nav-menu-list-desktop">
              <li className="nav-menu-item-desktop">
                <Link className="nav-link-desktop" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-menu-item-desktop">
                <Link className="nav-link-desktop" to="/jobs">
                  Jobs
                </Link>
              </li>
            </ul>
            <button
              type="button"
              className="logout-btn"
              onClick={onClickLogout}
            >
              logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default withRouter(Header)
