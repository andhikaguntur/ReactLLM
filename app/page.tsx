"use client";
import { useState } from "react";
import { requestToGroq } from "./utils/groq";
import {Light} from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/hljs";

export default function Home() {
  const [data, setData] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
  const aiResponse = await requestToGroq(content);
  console.log({aiResponse});
  setData(aiResponse);
  }
  return (
    <div>
      <main className="flex flex-col gap-2 min-h-[80vh] justify-center items-center max-w-xl w-full mx-auto">
        <h1 className="text-4xl text-indigo-500">REACT | AI</h1>
        <form action="" className="flex flex-col gap-4 py-4 w-full">
          <input className="bg-white text-black py-2 px-4 text-md rounded-md" placeholder="Thoughts..?" id="content" type="text" value={content}
  onChange={(e) => setContent(e.target.value)}/>
          <button type="button" className="bg-indigo-500 text-white px-4 py-2 rounded-md" onClick={handleSubmit}>Kirim</button>
        </form>
        <div className="max-w-xl w-full mx-auto">
          { data ? ( <Light language="typescript" style={darcula} wrapLongLines={true}>{data}</Light>  ):null}
         
        </div>
      </main>
    </div>
  );
}
