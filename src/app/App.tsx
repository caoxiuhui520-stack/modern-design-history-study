import { AppRouter } from "./router";
import { StudyProvider } from "./studyState";
import "./styles.css";

export function App() {
  return <StudyProvider><AppRouter /></StudyProvider>;
}

