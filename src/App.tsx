import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';

import { Navbar } from '@/components/Navbar';
import Home from '@/pages/Home';
import Divination from '@/pages/Divination';
import Hexagrams from '@/pages/Hexagrams';
import HexagramDetail from '@/pages/HexagramDetail';
import IChing from '@/pages/IChing';
import About from '@/pages/About';

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/divination" component={Divination} />
          <Route path="/hexagrams" component={Hexagrams} />
          <Route path="/hexagrams/:id" component={HexagramDetail} />
          <Route path="/iching" component={IChing} />
          <Route path="/about" component={About} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter>;
}

export default App;
