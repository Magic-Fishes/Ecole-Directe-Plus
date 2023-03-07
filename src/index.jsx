import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
let avc = "aaa"
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
        {avc}
    </React.StrictMode>
)