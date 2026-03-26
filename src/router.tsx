import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import About from "./pages/About";
import Writing from "./pages/Writing";
import WritingPost from "./pages/WritingPost";
import Now from "./pages/Now";
import Top from "./pages/Top";
import Uses from "./pages/Uses";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import Music from "./pages/Music";
import Timeline from "./pages/Timeline";
import Admin from "./pages/Admin";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <About /> },
      { path: "projects", element: <Projects /> },
      { path: "posts", element: <Writing /> },
      { path: "posts/:slug", element: <WritingPost /> },
      { path: "music", element: <Music /> },
      { path: "now", element: <Now /> },
      { path: "top", element: <Top /> },
      { path: "uses", element: <Uses /> },
      { path: "timeline", element: <Timeline /> },
      { path: "admin", element: <Admin /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
