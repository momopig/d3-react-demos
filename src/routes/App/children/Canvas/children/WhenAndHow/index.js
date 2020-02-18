import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import NoDataBind from './children/NoDataBind'
import DataBind from './children/DataBind'
import DataBindTransition from './children/DataBindTransition'

const WhenAndHow = (props) => {
  const { match } = props
  return (
    <Switch>
      <Route path={`${match.url}/noDataBind`} component={NoDataBind}/>
      <Route path={`${match.url}/dataBind`} component={DataBind}/>
      <Route path={[`${match.url}/dataBindTransition`, `${match.url}/`]} component={DataBindTransition}/>
    </Switch>
  )
}
export default WhenAndHow
