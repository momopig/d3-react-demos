import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

// import Svg from './children/Svg'
import Canvas from './children/Canvas'

const App = (props) => {
  return (
    <Router>
        <Switch>
          <Route path={['/canvas', '/']} component={Canvas}/>
        </Switch>
    </Router>
  )
}
export default App
