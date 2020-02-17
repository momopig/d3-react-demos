import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import WhenAndHow from './children/WhenAndHow'
const Canvas =() => {
  return (
    <HashRouter>
      <Switch>
        <Route>
          <Route path='/whenAndHow' component={WhenAndHow}/>
          <Route path='/' component={WhenAndHow}/>
        </Route>
      </Switch>

    </HashRouter>
  )
}
export default Canvas


