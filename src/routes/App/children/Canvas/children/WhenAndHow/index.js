import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import NoDataBind from './children/NoDataBind'
import DataBind from './children/DataBind'
import DataBindTransition from './children/DataBindTransition'

const WhenAndHow = (props) => {
  const { match } = props
  const BASE_URL = '/canvas/whenAndHow'
  return (
    <div>
      <p><Link to={`${BASE_URL}/NoDataBind`}>1. NoDataBind</Link></p>
      <p><Link to={`${BASE_URL}/DataBind`}>2. DataBind</Link></p>
      <p><Link to={`${BASE_URL}/DataBindTransition`}>3. DataBindTransition</Link></p>
      <Switch>
        <Route path={`${match.url}/noDataBind`} component={NoDataBind}/>
        <Route path={`${match.url}/dataBind`} component={DataBind}/>
        <Route path={[`${match.url}/dataBindTransition`, `${match.url}/`]} component={DataBindTransition}/>
      </Switch>
    </div>

  )
}
export default WhenAndHow
