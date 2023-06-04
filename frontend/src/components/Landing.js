import hero from "../assets/hero.svg"
import { Link } from "react-router-dom"
import "../LandingPage.css"

const Landing = () => {

    return (
        <div>
        <header className="page-header gradient">

        <div className="container pt-6">

          <div className="row align-items-center justify-content-center">

            <div className="col-md-5">
                <div className="mt-4 w-100">
                    <h1 className="display-1">Welcome to NoteMesh</h1>
                    <p>
                    The perfect platform to streamline your academic life. With NoteMesh, you can easily collaborate with your classmates, share notes, and create study groups.
                    </p>
                    
                </div>
              

                <button className="mt-3 btn btn-primary badge customBtn text-dark">
                  <Link to="/register" className="text-dark">
                    Try it out
                  </Link>
                </button>

            </div>

            <div className="col-md-5 mt-3 d-flex justify-content-center align-items-center">
              <img
                src={hero}
                alt="Header image"
                class="img-fluid animated"
              />
            </div>
          </div>
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
          <path
            fill="#fff"
            fill-opacity="1"
            d="M0,128L48,117.3C96,107,192,85,288,80C384,75,480,85,576,112C672,139,768,181,864,181.3C960,181,1056,139,1152,122.7C1248,107,1344,117,1392,122.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>

      </header>

      </div>

    )
}

export default Landing