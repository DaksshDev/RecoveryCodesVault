import { Switch, Route } from "wouter";
import Dashboard from "./pages/Dashboard";
import ServiceDetail from "./pages/ServiceDetail";
import NotFound from "./pages/not-found";

function App() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/service/:id" component={ServiceDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;