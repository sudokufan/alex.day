import { Outlet } from "react-router-dom";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export default function RootLayout() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Nav />
      <main className="pt-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
