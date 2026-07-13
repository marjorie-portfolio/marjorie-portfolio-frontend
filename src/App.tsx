import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Marjorie | Developer Portfolio</h1>
          <p>
            I build accessible and performant web experiences with React, TypeScript,
            and modern frontend tooling.
          </p>
        </div>
      </section>

      <div className="ticks"></div>

      <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Featured Projects</h2>
          <p>Recent work that highlights my development focus.</p>
          <ul>
            <li>
              <a
                href="https://github.com/Khatejang-starters/marjorie-portfolio-frontend"
                target="_blank"
                rel="noreferrer"
              >
                <img className="logo" src={viteLogo} alt="" />
                Portfolio Frontend
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank" rel="noreferrer">
                <img className="button-icon" src={reactLogo} alt="" />
                React Learning Hub
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect With Me</h2>
          <p>Open to collaborations and frontend opportunities.</p>
          <ul>
            <li>
              <a
                href="https://github.com/Khatejang"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noreferrer"
              >
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#social-icon"></use>
                </svg>
                LinkedIn
              </a>
            </li>
            <li>
              <a href="mailto:marjorie.dev@example.com">
                <svg
                  className="button-icon"
                  role="presentation"
                  aria-hidden="true"
                >
                  <use href="/icons.svg#documentation-icon"></use>
                </svg>
                Email
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App
