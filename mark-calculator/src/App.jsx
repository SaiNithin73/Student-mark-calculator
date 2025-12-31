import React, { useState } from 'react';
import './App.css';

const gradePoints = {
  'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'P': 4, 'F': 0
};

function App() {
  const [mode, setMode] = useState('Marks'); // 'school', 'gpa', or 'cgpa'
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [items, setItems] = useState([{ name: '', val1: '', val2: 'O' }]); // Generic state for all modes
  const [result, setResult] = useState(null);

  const resetAll = (newMode) => {
    setMode(newMode);
    setResult(null);
    if (newMode === 'cgpa') {
      setItems([{ name: 'Semester 1', val1: '' }]);
    } else if (newMode === 'gpa') {
      setItems([{ name: '', val1: '3', val2: 'A' }]); // val1 = Credits, val2 = Grade
    } else {
      setItems([{ name: '', val1: '' }]); // val1 = Marks
    }
  };

  const calculate = () => {
    if (mode === 'school') {
      const total = items.reduce((sum, i) => sum + Number(i.val1 || 0), 0);
      const avg = (total / items.length).toFixed(2);
      setResult({ main: `${avg}%`, sub: `Total: ${total}` });
    } else if (mode === 'gpa') {
      let totalPts = 0, totalCr = 0;
      items.forEach(i => {
        totalPts += (gradePoints[i.val2] * Number(i.val1 || 0));
        totalCr += Number(i.val1 || 0);
      });
      setResult({ main: (totalPts / totalCr).toFixed(2), sub: `Total Credits: ${totalCr}` });
    } else {
      const valid = items.filter(i => i.val1 !== '');
      const totalGpa = valid.reduce((sum, i) => sum + Number(i.val1), 0);
      setResult({ main: (totalGpa / valid.length).toFixed(2), sub: `Overall Standing` });
    }
  };

  return (
    <div className={`app-wrapper ${isDarkMode ? 'dark' : 'light'}`}>
      <button className="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
        {isDarkMode ? '☀️' : '🌙'}
      </button>

      <div className="glass-card">
        <div className="triple-mode-switch">
          <button className={mode === 'school' ? 'active' : ''} onClick={() => resetAll('school')}>School</button>
          <button className={mode === 'gpa' ? 'active' : ''} onClick={() => resetAll('gpa')}>GPA</button>
          <button className={mode === 'cgpa' ? 'active' : ''} onClick={() => resetAll('cgpa')}>CGPA</button>
        </div>

        <h1 className="hero-title">
          {mode === 'school' ? 'Mark Sheet' : mode === 'gpa' ? 'GPA Calc' : 'CGPA Tracker'}
        </h1>

        <div className="input-list">
          {items.map((item, index) => (
            <div key={index} className="modern-row">
              <input 
                placeholder={mode === 'cgpa' ? "Sem Name" : "Subject"} 
                className="base-input" 
                value={item.name} 
                onChange={(e) => {
                  const n = [...items]; n[index].name = e.target.value; setItems(n);
                }} 
              />
              
              {mode === 'gpa' && (
                <select 
                  className="base-input small-input grade-select" 
                  value={item.val2} 
                  onChange={(e) => {
                    const n = [...items]; n[index].val2 = e.target.value; setItems(n);
                  }}
                >
                  {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              )}

              <input 
                type="number" 
                placeholder={mode === 'school' ? "Marks" : mode === 'gpa' ? "Credits" : "GPA"} 
                className="base-input small-input" 
                value={item.val1} 
                onChange={(e) => {
                  const n = [...items]; n[index].val1 = e.target.value; setItems(n);
                }} 
              />
              <button className="row-del" onClick={() => setItems(items.filter((_, i) => i !== index))}>×</button>
            </div>
          ))}
        </div>

        <button className="fancy-add-btn" onClick={() => setItems([...items, { name: mode === 'cgpa' ? `Sem ${items.length + 1}` : '', val1: mode === 'gpa' ? '3' : '', val2: 'A' }])}>
          + Add Field
        </button>

        <div className="main-actions">
          <button className="glow-calc-btn" onClick={calculate}>Analyze</button>
          <button className="clear-btn" onClick={() => resetAll(mode)}>Reset</button>
        </div>

        {result && (
          <div className="stats-container">
            <div className="grade-box">
              <h2>{result.main}</h2>
              <span>{result.sub}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;