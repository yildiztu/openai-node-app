import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [prompterInput, setPrompterInput] = useState("");
  const [results, setResults] = useState([]);
  const [copiedIndices, setCopiedIndices] = useState([]); // new state variable

  async function onSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompter: prompterInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResults([data.result, ...results]);
      setPrompterInput("");
      setIsSubmitting(false);
    } catch(error) {
      console.error(error);
      alert(error.message);
    }
  }

  function copyToClipboard(index) {
    navigator.clipboard.writeText(results[index])
      .then(() => {
        setCopiedIndices([...copiedIndices, index]); // add index to copiedIndices
        setTimeout(() => {
          setCopiedIndices(copiedIndices.filter(i => i !== index)); // remove index from copiedIndices after 1.5 seconds
        }, 1500);
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to copy to clipboard');
      });
  }

  return (
    <div>
      <Head>
        <title>OpenAI</title>
      </Head>

      <main className={styles.main}>
        <h3>Ask me</h3>
        <form onSubmit={onSubmit}>
          <textarea
            type="textarea"
            name="prompter"
            placeholder="Prompt"
            value={prompterInput}
            onChange={(e) => setPrompterInput(e.target.value)}
          />
          <input
            type="submit"
            value={isSubmitting ? 'Wait (In progress...)' : 'Send'}
            disabled={isSubmitting}
          />
        </form>
        {results.map((result, index) => (
          <div key={index} className={styles.result}>
            <button onClick={() => copyToClipboard(index)}>
              {copiedIndices.includes(index) ? 'Copied!' : 'Copy to clipboard'} {/* check if index is in copiedIndices */}
            </button>
            <div style={{whiteSpace: 'pre-wrap', width: '50%', overflow: 'auto'}}>{result}</div>
          </div>
        ))}
      </main>
    </div>
  );
}