import { Navbar, Welcome, Footer } from './components';  {/* export at ../components/index.js then import*/}

const App = () => {
  return (
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen">
      <div className="bg-[#13131a]">
        <Navbar />
        <Welcome />
      </div>
      <Footer />
    </div>
  );
}

export default App;
