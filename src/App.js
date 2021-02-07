import SectionProvider from './sectionsApi/SectionsContext';
import ConnectedView from './components/MainView';



function App() {
  return (
      <div className="App">
        <SectionProvider>
          <ConnectedView />
        </SectionProvider>
      </div>
  );
}

export default App;
