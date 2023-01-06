import "@/styles/tailwind.css";
import "focus-visible";

export default function App({ Component }: any) {
  return (
    <div className="relative">
      <Component />
    </div>
  );
}
