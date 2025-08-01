// components/Footer.tsx
export default function Footer() {
  return (
    <footer className="mt-10 bg-green-700 text-white text-center py-4">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} Diagnosis Abses Gigi. All rights
        reserved.
      </p>
    </footer>
  );
}
