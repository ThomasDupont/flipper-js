import { useEffect, useState } from "react"
import { Effect as T, pipe } from 'effect'
import { changeFeatureState, getFeatures } from "../api/api"
import { Button, Container, Col, Row, Card, ListGroup } from 'react-bootstrap';


const FeatureCard = ({ feature, isEnabled } : {
    feature: string, 
    isEnabled: boolean
}) => {
    const [ errorMessage, setErrorMessage ] = useState<string>('')
    const [ featureIsEnabled, setFeatureIsEnabled ] = useState(isEnabled)

    const changeStatus = async (feature: string, enabled: boolean) => {
        pipe(
            T.try(() => localStorage.getItem('token')),
            T.flatMap(token => T.tryPromise(() => changeFeatureState(token ?? '')(feature, enabled))),
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

    return (
        <Row className="justify-content-md-center border w-75 p-3 mt-1 mb-1 ml-auto mr-auto" key={feature}>
            <Col className="col-4">
                <h2>{feature}</h2>
                {errorMessage && <span color="red">{errorMessage}</span>}
            </Col>
            <Col className="col-2">
                <span>{featureIsEnabled ? 'Enabled' : 'Disabled'}</span>
            </Col>
            <Col className="col-2">
                <Button onClick={() => changeStatus(feature, !featureIsEnabled)}>{featureIsEnabled ? 'Disable' : 'Enable'}</Button>
            </Col>
        </Row>
    )
}

export const Flipper = () => {
    const [ errorMessage, setErrorMessage ] = useState<string>('')
    const [ state, setState ] = useState<'done' | 'loading' | 'error'>('loading')
    const [ features, setFeatures ] = useState<Record<string, boolean>>({})

    useEffect(() => {
        pipe(
            T.try(() => localStorage.getItem('token')),
            T.flatMap(token => T.tryPromise(() => getFeatures(token ?? ''))),
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

    return (
        <Container fluid>
            <h1>Flipper</h1>
                {state === 'loading' && <p>Loading...</p>}
                {state === 'error' && <p>{errorMessage}</p>}
                {state === 'done' && 
                    Object.entries(features).map(([feature, isEnabled]) => (
                        <FeatureCard key={feature} feature={feature} isEnabled={isEnabled} />
                    ))
                }
        </Container>
    )

}
