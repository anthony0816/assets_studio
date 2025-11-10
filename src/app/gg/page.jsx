"use client";
import { useEffect, useState } from "react";

export default function Gemini() {
  const [error, setError] = useState(null);
  const [res, setRes] = useState(null);
  useEffect(() => {
    async function main() {
      fetch("api/ia/gg")
        .then((res) => res.json())
        .then(({ res, error }) => {
          console.log({ error });
          error && setError(error);
          console.log({ res });
        });
    }

    main();
  }, []);

  return (
    <>
      <p>{res}</p>
      <p className="text-blue-300">{error}</p>
    </>
  );
}
