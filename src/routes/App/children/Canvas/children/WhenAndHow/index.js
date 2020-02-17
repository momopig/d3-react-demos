import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import NoDataBind from './children/NoDataBind'
import DataBind from './children/DataBind'
import DataBindTransition from './children/DataBindTransition'

const WhenAndHow = (props) => {
  return (
    <HashRouter>
      <Switch>
        <Route path='/noDataBind' component={NoDataBind}/>
        <Route path='/dataBind' component={DataBind}/>
        <Route path='/test' component={DataBindTransition}/>
        <Route path='/' component={NoDataBind}/>
      </Switch>
    </HashRouter>
  )
}
export default WhenAndHow
