import { VideoConverter } from './components/video-converter';
import FeaturesSection from './components/features';
import HeaderSection from './components/header';
import './styles/index.css';

export function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <HeaderSection />
        <VideoConverter />
        <FeaturesSection />
      </div>
    </div>
  );
}

export default App;
