import {AuthProvider} from "../context/AuthContext";
import {ThemeProvider} from "../context/ThemeContext";

export default function AppProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        </AuthProvider>
    </ThemeProvider>
  );
}
