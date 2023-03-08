import * as React from 'react'
import {
  createBrowserRouter,
  Link,
  NavLink,
  Outlet,
  RouterProvider,
  useRouteError
} from 'react-router-dom'
import { ProjectErrorBoundary, projectLoader } from './routes/project/Project'

// Lazy loaded routes
const About = React.lazy(() => import('./routes/about/About'))
const Dashboard = React.lazy(() => import('./routes/dashboard/Dashboard'))
const Project = React.lazy(() => import('./routes/project/Project'))

// Route components
let router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '',
        element: <Outlet />,
        errorElement: <RootErrorBoundary />,
        children: [
          {
            path: 'about',
            element: (
              <React.Suspense fallback='...'>
                <About />
              </React.Suspense>
            )
          },
          {
            path: 'dashboard/*',
            element: (
              <React.Suspense fallback='...'>
                <Dashboard />
              </React.Suspense>
            )
          },
          {
            path: 'projects/:projectId',
            element: (
              <React.Suspense fallback='...'>
                <Project />
              </React.Suspense>
            ),
            errorElement: <ProjectErrorBoundary />,
            loader: projectLoader
          },
          {
            path: '*',
            element: <NoMatch />
          }
        ]
      }
    ]
  }
])

// The App just exports the router
export default function App() {
  return <RouterProvider router={router} fallbackElement={<Fallback />} />
}

function Layout() {
  return (
    <>
      <nav className='nav'>
        <div className='nav-start'>
          <NavLink to='/projects/authorized'>Auth</NavLink>
          <NavLink to='/projects/unauthorized'>Forbidden</NavLink>
          <NavLink to='/projects/broken'>Broken</NavLink>
        </div>
        <div className='nav-center'>
          <Link className='brand' to='/'>
            <img src='https://www.svgrepo.com/show/303157/react-logo.svg' alt='' />
          </Link>
        </div>
        <div className='nav-end'>
          <Link to='/dashboard'>Dashboard</Link>
          <Link to='/dashboard/messages'>Messages</Link>
          <Link to='/about'>About</Link>
        </div>
      </nav>

      <div className='container'>
        <p>
          This example shows the flexibility of <code>&lt;Route errorElement&gt;</code>
        </p>
        <ul>
          <li>
            Clicking the "Authorized Project" link will take you to the happy path where we
            successfully load and render the details for a project.
          </li>
          <li>
            Clicking the "Unauthorized Project" link will simulate a case where the user does not
            have access to the given project, so our loader can throw a 401 response that is handed
            in-context by a <code>&lt;ProjectErrorBoundary&gt;</code>.
          </li>
          <li>
            Clicking the "Broken Project" link will return some malformed data causing a render
            error. This is beyond what <code>&lt;ProjectErrorBoundary&gt;</code> can handle, so it
            re-throws the error and it gets handled by <code>&lt;RootErrorBoundary&gt;</code>{' '}
            instead.
          </li>
        </ul>
        <Outlet />
      </div>
    </>
  )
}

export function Fallback() {
  return <p>Performing initial data "load"</p>
}

export function RootErrorBoundary() {
  let error = useRouteError() as Error
  return (
    <div>
      <h1>Uh oh, something went terribly wrong 😩</h1>
      <pre>{error.message || JSON.stringify(error)}</pre>
      <button onClick={() => (window.location.href = '/')}>Click here to reload the app</button>
    </div>
  )
}

function NoMatch() {
  return (
    <div>
      <h2>This is a custom 404 page</h2>
      <p>
        <Link to='/'>Go to the home page</Link>
      </p>
    </div>
  )
}

if (import.meta.hot) {
  // Live Reload when the router config changes
  import.meta.hot.dispose(() => router.dispose())
}
