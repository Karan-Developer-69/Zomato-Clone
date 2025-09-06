import AppRoutes from "./routes/AppRoutes"
import { AuthProvider } from "./contexts/AuthContext"
import { CookiesProvider } from 'react-cookie';

function App() {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  console.log(SERVER_URL);
  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>
    <AuthProvider serverUrl={SERVER_URL}>
      <AppRoutes />
    </AuthProvider>
    </CookiesProvider>
  )
}

export default App
