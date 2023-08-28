import {Component} from 'react'
import {Redirect, Link} from 'react-router-dom'
import {BsSearch} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import {TiLocation} from 'react-icons/ti'
import {BiBriefcase} from 'react-icons/bi'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    searchInput: '',
    profileDetails: {},
    profileApiStatus: apiStatusConstants.initial,
    jobDetailsApiStatus: apiStatusConstants.initial,
    jobDetails: [],
    selectedEmploymentType: [],
    activeSalaryRangeId: '',
  }

  componentDidMount = () => {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  getJobsDetails = async () => {
    this.setState({jobDetailsApiStatus: apiStatusConstants.inProgress})
    const {
      selectedEmploymentType,
      activeSalaryRangeId,
      searchInput,
    } = this.state
    const selectedJoinedEmploymentType = selectedEmploymentType.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/jobs?employment_type=${selectedJoinedEmploymentType}&minimum_package=${activeSalaryRangeId}&&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(url, options)
    console.log(response)

    if (response.ok === true) {
      const fetchJobDetails = await response.json()
      console.log(fetchJobDetails)
      const formattedJobsDetails = fetchJobDetails.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobDetailsApiStatus: apiStatusConstants.success,
        jobDetails: formattedJobsDetails,
      })
    } else {
      this.setState({jobDetailsApiStatus: apiStatusConstants.failure})
    }
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    console.log(response)

    if (response.ok === true) {
      const fetchProfileDetails = await response.json()
      console.log(fetchProfileDetails)
      const formattedData = {
        name: fetchProfileDetails.profile_details.name,
        profileImageUrl: fetchProfileDetails.profile_details.profile_image_url,
        shortBio: fetchProfileDetails.profile_details.short_bio,
      }
      console.log(formattedData)

      this.setState({
        profileApiStatus: apiStatusConstants.success,
        profileDetails: formattedData,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSearch = event => {
    this.setState({searchInput: event.target.value})
  }

  onClickSearchIcon = () => {
    this.getJobsDetails()
  }

  onClickProfileDetailsRetryButton = () => {
    this.getProfileDetails()
  }

  onClickJobsDetailsRetryButton = () => {
    this.getJobsDetails()
  }

  renderSearchInputView = className => {
    const {searchInput} = this.state

    return (
      <div className={`${className}`}>
        <input
          type="search"
          placeholder="Search"
          className="search-input"
          onChange={this.onChangeSearch}
          value={searchInput}
        />

        <button
          type="button"
          data-testid="searchButton"
          className="search-btn"
          onClick={this.onClickSearchIcon}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileSuccessView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails
    return (
      <div className="profile-container">
        <img className="profile-img" src={profileImageUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="short-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <div className="profile-failure-container">
      <button
        className="retry-button"
        type="button"
        onClick={this.onClickProfileDetailsRetryButton}
      >
        Retry
      </button>
    </div>
  )

  renderProfileView = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()

      case apiStatusConstants.success:
        return this.renderProfileSuccessView()

      case apiStatusConstants.failure:
        return this.renderProfileFailureView()

      default:
        return null
    }
  }

  onSelectEmploymentType = event => {
    const {value, checked} = event.target
    const {selectedEmploymentType} = this.state

    if (checked === true) {
      this.setState(
        {
          selectedEmploymentType: [...selectedEmploymentType, value],
        },
        this.getJobsDetails,
      )
    } else {
      const updatedSelectedEmploymentType = selectedEmploymentType.filter(
        eachEmployment => eachEmployment !== value,
      )

      this.setState(
        {selectedEmploymentType: updatedSelectedEmploymentType},
        this.getJobsDetails,
      )
    }
  }

  onClickSalaryRange = event => {
    const {value} = event.target

    console.log(event.target)

    this.setState({activeSalaryRangeId: value}, this.getJobsDetails)
  }

  renderEmploymentTypeView = () => {
    const {selectedEmploymentType} = this.state

    return (
      <div className="jobs-filters-container">
        <h1 className="jobs-filters-heading">Type of Employment</h1>
        <ul className="jobs-filters-list-container">
          {employmentTypesList.map(eachEmploymentType => (
            <li className="list-item" key={eachEmploymentType.employmentTypeId}>
              <input
                type="checkbox"
                className="jobs-filters-input"
                id={eachEmploymentType.employmentTypeId}
                value={eachEmploymentType.employmentTypeId}
                onChange={this.onSelectEmploymentType}
                checked={selectedEmploymentType.includes(
                  eachEmploymentType.employmentTypeId,
                )}
              />
              <label
                className="label"
                htmlFor={eachEmploymentType.employmentTypeId}
              >
                {eachEmploymentType.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderSalaryRangeView = () => {
    const {activeSalaryRangeId} = this.state

    return (
      <div className="jobs-filters-container">
        <h1 className="jobs-filters-heading">Salary Range</h1>
        <ul className="jobs-filters-list-container">
          {salaryRangesList.map(eachSalary => (
            <li className="list-item" key={eachSalary.salaryRangeId}>
              <input
                type="radio"
                name="salary-range"
                className="jobs-filters-input"
                id={eachSalary.salaryRangeId}
                value={eachSalary.salaryRangeId}
                checked={activeSalaryRangeId === eachSalary.salaryRangeId}
                onChange={this.onClickSalaryRange}
              />
              <label className="label" htmlFor={eachSalary.salaryRangeId}>
                {eachSalary.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderNoJobsFoundView = () => (
    <div className="no-jobs-found-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        className="no-jobs-found-img"
        alt="no jobs"
      />
      <h1 className="heading">No Jobs Found</h1>
      <p className="description">
        We could not find any jobs. Try other filters
      </p>
      <button
        type="button"
        className="on-retry-button"
        onClick={this.onClickRetryButton}
      >
        Retry
      </button>
    </div>
  )

  renderJobDetailsSuccessView = () => {
    const {jobDetails} = this.state
    console.log(jobDetails)

    if (jobDetails.length < 1) {
      return this.renderNoJobsFoundView()
    }
    return (
      <ul className="jobs-list-container">
        {jobDetails.map(eachJob => (
          <li className="list-item-job" key={eachJob.id}>
            <Link to={`/jobs/${eachJob.id}`} className="nav-link">
              <div className="company-logo-and-job-title-container">
                <img
                  src={eachJob.companyLogoUrl}
                  alt="company logo"
                  className="company-logo"
                />
                <div className="job-title-and-rationg-container">
                  <h1 className="company-name">{eachJob.title}</h1>
                  <div className="rating-container">
                    <AiFillStar className="star-icon" />
                    <p className="rating">{eachJob.rating}</p>
                  </div>
                </div>
              </div>
              <div className="location-job-type-salary-package-container">
                <div className="location-and-job-type-container">
                  <div className="location-container">
                    <TiLocation className="location-icon" />
                    <p className="job-location">{eachJob.location}</p>
                  </div>
                  <div className="job-type-container">
                    <BiBriefcase className="job-icon" />
                    <p className="job-type">{eachJob.employmentType}</p>
                  </div>
                </div>

                <p className="salary-package">{eachJob.packagePerAnnum}</p>
              </div>
              <hr />
              <h1 className="description-heading">Description</h1>
              <p className="job-description">{eachJob.jobDescription}</p>
            </Link>
          </li>
        ))}
      </ul>
    )
  }

  renderJobDetailsFailureView = () => (
    <div>
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-view-img"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for
      </p>
      <button
        className="retry-button"
        type="button"
        onClick={this.onClickJobsDetailsRetryButton}
      >
        Retry
      </button>
    </div>
  )

  renderJobDetailsView = () => {
    const {jobDetailsApiStatus} = this.state

    switch (jobDetailsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()

      case apiStatusConstants.success:
        return this.renderJobDetailsSuccessView()

      case apiStatusConstants.failure:
        return this.renderJobDetailsFailureView()

      default:
        return null
    }
  }

  render() {
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken === undefined) {
      return <Redirect to="/login" />
    }
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="responsive-container-jobs">
            {this.renderSearchInputView('sm-view-input-container')}
            <div className="profile-job-type-and-employment-container">
              {this.renderProfileView()}
              <hr className="horizontal-line" />
              {this.renderEmploymentTypeView()}
              <hr className="horizontal-line" />
              {this.renderSalaryRangeView()}
            </div>

            <div className="search-input-and-job-details-container">
              {this.renderSearchInputView('lg-view-input-container')}
              {this.renderJobDetailsView()}
            </div>
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
