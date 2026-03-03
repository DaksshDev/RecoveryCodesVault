import { Switch, Route } from "wouter";
import Dashboard from "./pages/Dashboard";
import ServiceDetail from "./pages/ServiceDetail";
import NotFound from "./pages/not-found";
import LoadingDialog from "./components/LoadingDialog";
import { useServices } from "./lib/store";

function App() {
  const { isInitialLoading } = useServices();

  return (
    <>
      <LoadingDialog isOpen={isInitialLoading} />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/service/:id" component={ServiceDetail} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

export default App;