import { Route, Redirect } from 'react-router-dom'
import "./App.css";
import "./index.css";
import Home from './pages/Home';
import Tema from './pages/Tema';
import Subtema from './pages/Subtema';
import TemeRom from './pages/TemeRom';
import TemeMatem from './pages/TemeMatem';
import TemeIstoria from './pages/TemeIstoria';


function App() {

  return (
    <div className="App">
      <div>
        <Route path='/' exact>
          <Redirect to='/home' />
        </Route>
        <Route path='/home'>
          <Home />
        </Route> 
        <Route path='/teme-romana'>
          <TemeRom />
        </Route>    
        <Route path='/teme-matem'>
          <TemeMatem />
        </Route>  
        <Route path='/teme-istoria'>
          <TemeIstoria />
        </Route>   
        <Route path='/tema1'>
          <Tema />
        </Route>   
        <Route path='/subtema1'>
          <Subtema />
        </Route>       
      </div>
      {/* <Card title="Disciplinele de absolvire a cursului gimnazial">
          <ListDiscipline list = {discipline} />
      </Card> */}
    </div>
  );
}

export default App;
