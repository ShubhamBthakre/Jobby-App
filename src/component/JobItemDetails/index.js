import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {TiLocation} from 'react-icons/ti'
import {BiBriefcase, BiLinkExternal} from 'react-icons/bi'
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

class JobItemDetails extends Component {
  state = {
    jobItemDetails: {},
    jobItemDetailsApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  onRetryButton = () => {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({jobItemDetailsApiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params
    const url = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    console.log(response)

    if (response.ok === true) {
      const fetchedJobItemDetails = await response.json()
      console.log(fetchedJobItemDetails)

      const formattedJobItemDetails = {
        jobDetails: {
          companyLogoUrl: fetchedJobItemDetails.job_details.company_logo_url,
          companyWebsiteUrl:
            fetchedJobItemDetails.job_details.company_website_url,
          employmentType: fetchedJobItemDetails.job_details.employment_type,
          id: fetchedJobItemDetails.job_details.id,
          jobDescription: fetchedJobItemDetails.job_details.job_description,
          lifeAtCompany: {
            imageUrl:
              fetchedJobItemDetails.job_details.life_at_company.image_url,
            description:
              fetchedJobItemDetails.job_details.life_at_company.description,
          },
          location: fetchedJobItemDetails.job_details.location,
          packagePerAnnum: fetchedJobItemDetails.job_details.package_per_annum,
          rating: fetchedJobItemDetails.job_details.rating,
          skills: fetchedJobItemDetails.job_details.skills.map(eachSkill => ({
            imageUrl: eachSkill.image_url,
            name: eachSkill.name,
          })),
          title: fetchedJobItemDetails.job_details.title,
          similarJobs: fetchedJobItemDetails.similar_jobs.map(eachJob => ({
            companyLogoUrl: eachJob.company_logo_url,
            employmentType: eachJob.employment_type,
            id: eachJob.id,
            jobDescription: eachJob.job_description,
            location: eachJob.location,
            rating: eachJob.rating,
            title: eachJob.title,
          })),
        },
      }

      console.log(formattedJobItemDetails)

      this.setState({
        jobItemDetailsApiStatus: apiStatusConstants.success,
        jobItemDetails: formattedJobItemDetails,
      })
    } else {
      this.setState({jobItemDetailsApiStatus: apiStatusConstants.failure})
    }
  }

  renderJobDetails = () => {
    const {jobItemDetails} = this.state
    const {jobDetails} = jobItemDetails
    const {
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      companyLogoUrl,
      skills,
      lifeAtCompany,
      companyWebsiteUrl,
    } = jobDetails

    const {description, imageUrl} = lifeAtCompany

    return (
      <div className="job-details-container">
        <div className="company-logo-and-job-title-container">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="company-logo"
          />
          <div className="job-title-and-rating-container">
            <h1 className="company-name">{title}</h1>
            <div className="rating-container">
              <AiFillStar className="star-icon" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-job-type-salary-package-container">
          <div className="location-and-job-type-container">
            <div className="location-container">
              <TiLocation className="location-icon" />
              <p className="job-location">{location}</p>
            </div>
            <div className="job-type-container">
              <BiBriefcase className="job-icon" />
              <p className="job-type">{employmentType}</p>
            </div>
          </div>

          <p className="salary-package">{packagePerAnnum}</p>
        </div>
        <hr />
        <div className="description-and-company-link-container">
          <h1 className="job-item-details-heading">Description</h1>
          <a
            className="visit-link-text"
            href={companyWebsiteUrl}
            target="_blank"
            rel="noreferrer"
          >
            Visit
            <BiLinkExternal className="visit-link-icon" />
          </a>
        </div>

        <p className="job-description">{jobDescription}</p>

        <h1 className="job-item-details-heading">Skills</h1>
        <ul className="skills-list">
          {skills.map(eachSkill => (
            <li className="skill-item" key={eachSkill.name}>
              <img
                src={eachSkill.imageUrl}
                alt={eachSkill.name}
                className="skill-logo"
              />
              <p className="skill-name">{eachSkill.name}</p>
            </li>
          ))}
        </ul>

        <h1 className="job-item-details-heading">Life at Company</h1>
        <div className="life-at-company-container">
          <p className="life-at-company-description job-description">
            {description}
          </p>
          <img
            src={imageUrl}
            alt="life at company"
            className="life-at-company-img"
          />
        </div>
      </div>
    )
  }

  renderSimilarJobDetails = () => {
    const {jobItemDetails} = this.state
    const {jobDetails} = jobItemDetails
    const {similarJobs} = jobDetails

    return (
      <div className="similar-job-details-container">
        <h1 className="similar-job-heading">Similar Jobs</h1>
        <ul className="similar-job-list">
          {similarJobs.map(eachJob => (
            <li className="similar-job-item" key={eachJob.id}>
              <div className="company-logo-and-job-title-container">
                <img
                  src={eachJob.companyLogoUrl}
                  alt="similar job company logo"
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
              <h1 className="description-heading">Description</h1>
              <p className="job-description">{eachJob.jobDescription}</p>
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
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  renderSuccessView = () => (
    <div className="job-details-success-view">
      {this.renderJobDetails()}
      {this.renderSimilarJobDetails()}
    </div>
  )

  renderFailureView = () => (
    <div className="job-section-failure-view">
      <img
        className="job-section-failure-image"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="job-section-failure-error">Oops! Something Went Wrong</h1>
      <p className="job-section-failure-message">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="job-section-failure-retry-btn"
        onClick={this.onRetryButton}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobItemDetailsView = () => {
    const {jobItemDetailsApiStatus} = this.state

    switch (jobItemDetailsApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      case apiStatusConstants.success:
        return this.renderSuccessView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

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
        <div className="job-item-details-container">
          <div className="responsive-container-job-item-details">
            {this.renderJobItemDetailsView()}
          </div>
        </div>
      </>
    )
  }
}

export default JobItemDetails
