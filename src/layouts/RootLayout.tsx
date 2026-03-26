import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function RootLayout() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Header />
      <main className="pt-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
