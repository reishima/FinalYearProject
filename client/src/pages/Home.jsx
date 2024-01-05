import { Navbar, Welcome, Footer } from '../components/index.js';  

const App = () => {
  return (
    <div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-col">
      <div className="bg-[#13131a] flex-grow">
        <Navbar />
        <div className='mt-[60px]'>
          <Welcome />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;

