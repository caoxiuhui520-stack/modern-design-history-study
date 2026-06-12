import { HashRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "../components/AppShell";
import { HomePage } from "../features/home/HomePage";
import { KnowledgeMapPage } from "../features/knowledge/KnowledgeMapPage";
import { PracticePage } from "../features/practice/PracticePage";
import { MistakesPage } from "../features/mistakes/MistakesPage";
import { ProfilePage } from "../features/profile/ProfilePage";

export function AppRouter() {
  return (
    <HashRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/knowledge" element={<KnowledgeMapPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/mistakes" element={<MistakesPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </AppShell>
    </HashRouter>
  );
}

