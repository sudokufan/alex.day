import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import About from "./pages/About";
import Writing from "./pages/Writing";
import WritingPost from "./pages/WritingPost";
import Now from "./pages/Now";
import Top from "./pages/Top";
import Uses from "./pages/Uses";
import Stats from "./pages/Stats";
import Projects from "./pages/Projects";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <About /> },
      { path: "projects", element: <Projects /> },
      { path: "writing", element: <Writing /> },
      { path: "writing/:slug", element: <WritingPost /> },
      { path: "now", element: <Now /> },
      { path: "top", element: <Top /> },
      { path: "uses", element: <Uses /> },
      { path: "stats", element: <Stats /> },
      { path: "admin", element: <Admin /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
