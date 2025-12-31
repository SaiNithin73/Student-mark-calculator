import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './App.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function App() {
  const [mode, setMode] = useState('school'); // 'school' or 'college'
  const [subjects, setSubjects] = useState([
    { name: '', score: '', credits: '3' }
  ]);
  const [result, setResult] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const addSubject = () => setSubjects([...subjects, { name: '', score: '', credits: '3' }]);

  const calculate = () => {
    const totalMarks = subjects.reduce((sum, s) => sum + Number(s.score || 0), 0);
    const avg = totalMarks / subjects.length;
    
    // College GPA Logic (Rough estimate based on 10-point scale)
    const totalCredits = subjects.reduce((sum, s) => sum + Number(s.credits || 0), 0);
    const gpa = (avg / 10).toFixed(2);

    let grade = 'F';
    let color = '#ff4d4d';
    if (avg >= 90) { grade = 'S'; color = '#00f2fe'; }
    else if (avg >= 80) { grade = 'A'; color = '#4facfe'; }
    else if (avg >= 70) { grade = 'B'; color = '#f9d423'; }
    else { grade = 'C'; color = '#667eea'; }

    setResult({ total: totalMarks, avg: avg.toFixed(2), gpa, grade, color });
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="glass-card">
        <div className="header-actions">
          <button className="mode-toggle" onClick={() => setMode(mode === 'school' ? 'college' : 'school')}>
            Switch to {mode === 'school' ? 'College (GPA)' : 'School (%)'}
          </button>
          <button className="theme-icon" onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>

        <h1 className="main-title">{mode === 'school' ? 'School Report' : 'University GPA'}</h1>

        <div className="subject-container">
          {subjects.map((sub, index) => (
            <div key={index} className="input-row-modern">
              <input 
                className="modern-input" 
                placeholder="Subject Name"
                value={sub.name} 
                onChange={(e) => {
                  const n = [...subjects]; n[index].name = e.target.value; setSubjects(n);
                }}
              />
              <input 
                className="modern-input small" 
                type="number" 
                placeholder="Mark" 
                value={sub.score}
                onChange={(e) => {
                  const n = [...subjects]; n[index].score = e.target.value; setSubjects(n);
                }}
              />
              {mode === 'college' && (
                <input 
                  className="modern-input small credit" 
                  type="number" 
                  placeholder="Cr" 
                  value={sub.credits}
                  onChange={(e) => {
                    const n = [...subjects]; n[index].credits = e.target.value; setSubjects(n);
                  }}
                />
              )}
              <button className="remove-btn" onClick={() => setSubjects(subjects.filter((_, i) => i !== index))}>×</button>
            </div>
          ))}
        </div>

        <div className="footer-btns">
          <button className="add-subject-btn" onClick={addSubject}>+ Add New Subject</button>
          <button className="analyze-btn" onClick={calculate}>Analyze Performance</button>
        </div>

        {result && (
          <div className="stats-display">
            <div className="grade-ring" style={{ borderColor: result.color }}>
              <h2 style={{ color: result.color }}>{result.grade}</h2>
              <p>{mode === 'school' ? `${result.avg}%` : `GPA: ${result.gpa}`}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;