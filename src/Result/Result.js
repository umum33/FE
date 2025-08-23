import React from "react";
import "./Result.css";

export default function Result() {
  const [title, setTitle] = React.useState("Fresh Apple");
  const [description, setDescription] = React.useState(
    `These apples were harvested this morning and are exceptionally sweet and crisp. Perfect for snacking or adding to your favorite recipes. Each batch is carefully handpicked to ensure the best quality.`
  );

  const handleCopy = async () => {
    const text = `${title ? title + "\n\n" : ""}${description || ""}`;
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied to clipboard!");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("Copied to clipboard!");
    }
  };

  return (
    <>
      {/* 최상단 고정 헤더 */}
      <header className="header">
        <div className="header__inner container">
          <div className="brand">
            <div className="logo-icon" aria-hidden="true">
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z" fill="currentColor"/>
              </svg>
            </div>
            <h1 className="brand__title">Orumi</h1>
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="rv-page">
        <section className="rv-card">
          <div className="rv-actions">
            <button
              type="button"
              className="rv-btn rv-btn-ghost"
              onClick={handleCopy}
              title="Copy title & description"
            >
              📋 Copy
            </button>
          </div>

          <header className="rv-header">
            <h1 className="rv-title">Generated Product Description</h1>
            <p className="rv-sub">
              Review and edit your title and description. Use the top-right button to copy.
            </p>
          </header>

          <div className="rv-divider" />

          <div className="rv-fields">
            <div className="rv-field">
              <label htmlFor="rv-title-input" className="rv-label">Product Title</label>
              <textarea
                id="rv-title-input"
                rows={2}
                className="rv-textarea rv-textarea--compact"
                placeholder="e.g., Fresh Organic Apples from Local Orchard"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="rv-field">
              <label htmlFor="rv-desc-input" className="rv-label">Description</label>
              <textarea
                id="rv-desc-input"
                rows={8}
                className="rv-textarea"
                placeholder="Write or edit the generated description here…"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
