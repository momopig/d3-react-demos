import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import WhenAndHow from './children/WhenAndHow'
const Canvas =(props) => {
  const { match } = props
  return (
    <Switch>
      <Route path={[`${match.url}/whenAndHow`, `${match.url}/`]} component={WhenAndHow}/>
    </Switch>
  )
}
export default Canvas


