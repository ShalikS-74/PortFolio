import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Home from './pages/Home';
import Loader from './components/Loader';

const queryClient = new QueryClient();

function App() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      {!isLoaded && <Loader onComplete={() => setIsLoaded(true)} />}

      <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, '') || ''}>
        <AnimatePresence mode="wait">
          {isLoaded && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <Switch>
                <Route path="/" component={Home} />
                <Route>
                  <div className="min-h-screen flex flex-col items-center justify-center font-sans text-center px-4 bg-background text-foreground">
                    <h1 className="text-8xl md:text-9xl font-bold tracking-normal mb-4">404</h1>
                    <p className="text-xl font-mono uppercase tracking-widest text-foreground/50">PAGE NOT FOUND</p>
                  </div>
                </Route>
              </Switch>
            </motion.div>
          )}
        </AnimatePresence>
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
