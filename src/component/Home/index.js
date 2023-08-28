import './index.css'
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Header from '../Header'

class Home extends Component {
  render() {
    return (
      <>
        <Header />
        <div className="home-container">
          <div className="home-content">
            <h1 className="home-content-heading">
              Find The Job That Fits Your Life
            </h1>
            <p className="description">
              Millions of people are searching for jobs, salary information,
              company review. Find the job that fits your abilities and
              potential.
            </p>
            <Link className="nav-link" to="/jobs">
              <button className="find-job-btn" type="button">
                Find Jobs
              </button>
            </Link>
          </div>
        </div>
      </>
    )
  }
}

export default Home
