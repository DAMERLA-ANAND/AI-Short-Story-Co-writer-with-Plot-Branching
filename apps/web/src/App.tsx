import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { NewStoryPage } from './pages/NewStoryPage.js';
import { StoryWorkspacePage } from './pages/StoryWorkspacePage.js';
import { LibraryPage } from './pages/LibraryPage.js';
import { SnapshotViewerPage } from './pages/SnapshotViewerPage.js';
import './styles/tokens.css';
import './styles/genres.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NewStoryPage />} />
        <Route path="/workspace/:storyId" element={<StoryWorkspacePage />} />
        <Route path="/snapshot/:snapshotId" element={<SnapshotViewerPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
