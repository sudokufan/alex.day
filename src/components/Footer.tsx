export default function Footer() {
  return (
    <footer className="mt-12 pt-8 border-t border-parchment pb-12">
      <p className="font-sans text-xs text-warm-gray">
        &copy; {new Date().getFullYear()} Alex Day
      </p>
    </footer>
  );
}
