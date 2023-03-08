import * as React from 'react'
import { json, useLoaderData, useRouteError, isRouteErrorResponse } from 'react-router-dom'

type ProjectData = {
  project: {
    id: string
    name: string
    owner: string
    deadline: string
    cost: string
  }
}

export function projectLoader({ params }: any) {
  if (params.projectId === 'unauthorized') {
    throw json({ contactEmail: 'administrator@fake.com' }, { status: 401 })
  }

  if (params.projectId === 'broken') {
    // Uh oh - in this flow we somehow didn't get our data nested under `project`
    // and instead got it at the root - this will cause a render error!
    return json({
      id: params.projectId,
      name: 'Break Some Stuff',
      owner: 'The Joker',
      deadline: 'June 2022',
      cost: 'FREE'
    })
  }

  return json({
    project: {
      id: params.projectId,
      name: 'Build Some Stuff',
      owner: 'Joe',
      deadline: 'June 2022',
      cost: '$5,000 USD'
    }
  })
}

export default function Project() {
  const { project } = useLoaderData() as ProjectData

  return (
    <>
      <h1>Project Name: {project.name}</h1>
      <p>Owner: {project.owner}</p>
      <p>Deadline: {project.deadline}</p>
      <p>Cost: {project.cost}</p>
    </>
  )
}

export function ProjectErrorBoundary() {
  const error = useRouteError()

  // We only care to handle 401's at this level, so if this is not a 401
  // ErrorResponse, re-throw to let the RootErrorBoundary handle it
  if (!isRouteErrorResponse(error) || error.status !== 401) {
    throw error
  }

  return (
    <>
      <h1>You do not have access to this project</h1>
      <p>
        Please reach out to{' '}
        <a href={`mailto:${error.data.contactEmail}`}>{error.data.contactEmail}</a> to obtain
        access.
      </p>
    </>
  )
}
