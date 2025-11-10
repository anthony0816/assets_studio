"use client";
import { _POST_ } from "@/utils/functions";
import { useEffect, useState } from "react";

export default function Gemini() {
  const [error, setError] = useState(null);
  const [res, setRes] = useState(null);
  const [promp, setPromp] = useState("");

  console.log({ promp });

  async function main() {
    _POST_("api/ia/gg", { promp })
      .then((res) => res.json())
      .then(({ res, error }) => {
        if (error) {
          setError(error);
          console.log({ error });
          return;
        }
        console.log({ res });
        setRes(res);
      });
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          main();
        }}
      >
        <input
          onChange={(e) => setPromp(e.target.value)}
          type="text"
          className="border border-white m-3  text-white "
        />
      </form>
      <p>{res}</p>
      <p className="text-blue-300">{error}</p>
    </>
  );
}
