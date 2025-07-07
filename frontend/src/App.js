import React from 'react'
import TeamCollaborationBoard from './components/TeamCollaborationBoard'
import Sidebar from './components/Sidebar'
import Board from './pages/Board'

const App = () => {
  // EnvTest.js
;

const EnvTest = () => {
  return (
    <div>
      <h2>ENV Test</h2>
      <p>{process.env.REACT_APP_API_BASE_URL || "Not Found"}</p>
    </div>
  );
};



  return (
    <>
    
    {/* <TeamCollaborationBoard/> */}
    <Board/>
    <EnvTest/>
    
    </>
  )
}

export default App