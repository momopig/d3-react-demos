import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Router, Link } from '@reach/router'
// import Svg from './children/Svg'
import Canvas from './children/Canvas'

const App = (props) => {
  return (
    <HashRouter>
      <Switch>
        <Route path='/canvas' component={Canvas}/>
        <Route path='/' component={Canvas}/>
      </Switch>
    </HashRouter>
  )
}
export default App
