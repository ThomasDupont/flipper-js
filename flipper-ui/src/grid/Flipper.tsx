import { useEffect, useState } from 'react'
import { Effect as T, pipe } from 'effect'
import { changeFeatureState, getFeatures } from '../api/api'
import { Button, Container, Col, Row } from 'react-bootstrap'

const FeatureCard = ({ feature, isEnabled }: {
  feature: string
  isEnabled: boolean
}): JSX.Element => {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [featureIsEnabled, setFeatureIsEnabled] = useState(isEnabled)

  const changeStatus = (feature: string, enabled: boolean): void => {
    void pipe(
      T.try(() => localStorage.getItem('token')),
      T.flatMap(token => T.tryPromise(async () => await changeFeatureState(token ?? '')(feature, enabled))),
      T.map(() => {
        setFeatureIsEnabled(enabled)
        return T.void
      }),
      T.catchAll((e) => {
        setErrorMessage(e.message)
        return T.void
      }),
      T.runPromise
    )
  }

  const status = featureIsEnabled ? 'Enabled' : 'Disabled'
  const color = featureIsEnabled ? '#198754' : '#dc3545'
  const buttonText = featureIsEnabled ? 'Disable' : 'Enable'
  const buttonType = featureIsEnabled ? 'danger' : 'success'

  return (
        <Row className="border p-3 mt-1 mb-1 ml-auto mr-auto" key={feature}>
            <Col className="col-4">
                <h2>{feature}</h2>
                {(errorMessage.length > 0) && <span style={{ color:  '#dc3545' }}>{errorMessage}</span>}
            </Col>
            <Col className="col-4">
                <p style={{ color }}>{status}</p>
            </Col>
            <Col className="col-4">
                <Button variant={buttonType} onClick={() => { changeStatus(feature, !featureIsEnabled) }}>{buttonText}</Button>
            </Col>
        </Row>
  )
}

export const Flipper = (): JSX.Element => {
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [state, setState] = useState<'done' | 'loading' | 'error'>('loading')
  const [features, setFeatures] = useState<Record<string, boolean>>({})

  useEffect(() => {
    void pipe(
      T.try(() => localStorage.getItem('token')),
      T.flatMap(token => T.tryPromise(async () => await getFeatures(token ?? ''))),
      T.map(({ features }) => {
        setState('done')
        setFeatures(features)
        return T.void
      }),
      T.catchAll((e) => {
        setState('error')
        setErrorMessage(e.message)
        return T.void
      }),
      T.runPromise
    )
  }, [])

  return <Container className="mt-3">
            <p>List all feature managed by Flipper</p>
                {state === 'loading' && <p>Loading...</p>}
                {state === 'error' && <p>{errorMessage}</p>}
                {state === 'done' &&
                    Object.entries(features).map(([feature, isEnabled]) => (
                        <FeatureCard key={feature} feature={feature} isEnabled={isEnabled} />
                    ))
                }
        </Container>
}
