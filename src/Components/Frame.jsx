export default function Frame({ children }) {
  return (
    <>
      <section className="bg-red-300 w-full h-[100vh] overflow-y-auto">
        {children}
      </section>
    </>
  );
}
