// File: App.js
import React, { useState } from 'react';

const App = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(0);

  return (
    <div style={styles.container}>
      <h1>Simple React Counter</h1>
      <div style={styles.counter}>
        <button onClick={decrement} style={styles.button}>-</button>
        <span style={styles.count}>{count}</span>
        <button onClick={increment} style={styles.button}>+</button>
      </div>
      <button onClick={reset} style={styles.resetButton}>Reset</button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
    fontFamily: 'Arial, sans-serif',
  },
  counter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '20px 0',
  },
  button: {
    fontSize: '20px',
    padding: '10px 20px',
    margin: '0 10px',
    cursor: 'pointer',
  },
  count: {
    fontSize: '24px',
    margin: '0 20px',
  },
  resetButton: {
    fontSize: '16px',
    padding: '10px 20px',
    cursor: 'pointer',
  },
};

export default App;
