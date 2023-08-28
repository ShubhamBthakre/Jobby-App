import './App.css'
import {Switch, Route, Redirect} from 'react-router-dom'
import ProtectedRoute from './component/ProtectedRoute'
import Login from './component/Login'
import Home from './component/Home'
import Jobs from './component/Jobs'
import NotFound from './component/NofFound'
import JobItemDetails from './component/JobItemDetails'

// These are the lists used in the application. You can move them to any component needed.

// Replace your code here
const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={Jobs} />
    <ProtectedRoute exact path="/jobs/:id" component={JobItemDetails} />
    <Route exact path="/not-found" component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
