import AppRoutes from "./routes/AppRoutes"
import { AuthProvider } from "./contexts/AuthContext"

function App() {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  console.log(SERVER_URL);
  return (
    <AuthProvider serverUrl={SERVER_URL}>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
