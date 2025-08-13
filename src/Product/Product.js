import "./Product.css";
import React, { useState, useRef, useEffect } from "react";

/** ▼ (모의) API: 실제 API가 있으면 fetch로 교체하세요 */
async function generateProductCopy(keywords) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!keywords || !keywords.trim()) {
        reject(new Error("키워드를 입력해 주세요."));
      } else {
        const title = `추천 상품: ${keywords.split(",")[0].trim()}`;
        const description =
          `입력 키워드 기반 자동 생성 결과입니다.\n\n- 키워드: ${keywords}\n- 특징: 가벼움, 편안함, 데일리 사용 적합\n\n*이 텍스트는 데모용으로 생성되었습니다.*`;
        resolve({ title, description });
      }
    }, 1200);
  });
}

/** ✅ 모달/임베드용: Result 카드 UI (이 파일 안에 정의) */
function ResultCard({
  initialTitle = "Fresh Apple",
  initialDescription = `These apples were harvested this morning and are exceptionally sweet and crisp. Perfect for snacking or adding to your favorite recipes. Each batch is carefully handpicked to ensure the best quality.`,
}) {
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);

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
    <section className="rv-card">
      {/* 우측 상단 액션 */}
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
  );
}

export default function Product() {
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState("");

  // 토스트 상태
  const [toast, setToast] = useState({ open: false, type: "success", message: "" });
  const toastTimer = useRef(null);

  // 결과 모달 상태
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [resultData, setResultData] = useState({ title: "", description: "" });

  // 토스트 자동 닫기
  useEffect(() => {
    if (!toast.open) return;
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, open: false })), 2500);
    return () => toastTimer.current && clearTimeout(toastTimer.current);
  }, [toast.open]);

  // 모달 열릴 때 배경 스크롤 잠금 + ESC 닫기
  useEffect(() => {
    if (!isResultOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setIsResultOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [isResultOpen]);

  const showToast = (type, message) => setToast({ open: true, type, message });

  const openResultModal = async () => {
    try {
      setLoading(true);
      const { title, description } = await generateProductCopy(keywords);
      setResultData({ title, description });
      showToast("success", "생성이 완료됐어요!");
      setIsResultOpen(true);
    } catch (err) {
      showToast("error", err?.message || "문제가 발생했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app" aria-busy={loading}>
      {/* Header (필요 시 네가 쓰던 마크업 유지) */}
      <header className="header">
        <div className="container header__inner">
          <div className="brand">
            <div className="logo-icon" aria-hidden="true">
              {/* 로고 SVG 예시 */}
              <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor" />
                <path fillRule="evenodd" clipRule="evenodd" d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z" fill="currentColor" />
              </svg>
            </div>
            <h1 className="brand__title">Orumi</h1>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="container hero" aria-label="등록 방식 선택">
          <div className="hero__text">
            <h2 className="hero__title">어떤 방법으로 상품 글을 생성하시겠습니까?</h2>
            <p className="hero__sub">키워드로 간단히 쓰거나, 말하면 글로 바꿔드립니다.</p>
          </div>
        </section>

        {/* 옵션 카드 */}
        <div className="cards-group container">
          <section className="grid grid--2">
            <div className="card-icon-box">
              <form className="ibox-form" onSubmit={(e) => e.preventDefault()}>
                <div className="ibox-header">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" />
                  </svg>                  <label className="ibox-label" htmlFor="keywordInput">키워드 입력</label>
                </div>
                <textarea
                  id="keywordInput"
                  className="ibox-input"
                  placeholder="예: 운동화, 편안함, 가벼움"
                  rows={7}
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                />
              </form>
            </div>

            <div className="card-icon-box card-icon-box--text">
              <button
                type="button"
                className="voice-icon-wrapper"
                aria-label="음성 입력"
                title="음성 입력"
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none"
                  xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 2A3 3 0 0 0 9 5V11A3 3 0 0 0 12 14A3 3 0 0 0 15 11V5A3 3 0 0 0 12 2Z"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M19 10V11A7 7 0 0 1 12 18A7 7 0 0 1 5 11V10"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 18V22" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 22H16" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>


              <p className="ibox-sub">말하면 텍스트로 변환해 글을 만들어 드립니다.</p>
            </div>
          </section>

          {/* CTA */}
          <section className="cta">
            <div className="container">
              <button
                type="button"
                className="cta-button"
                onClick={openResultModal}
                disabled={loading}
              >
                {loading ? "생성 중…" : "결과보기"}
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer__inner">
          <nav className="footer__nav">
            <a className="link" href="/terms">Terms of Service</a>
            <a className="link" href="/privacy">Privacy Policy</a>
            <a className="link" href="/contact">Contact Us</a>
          </nav>
          <p className="footer__copy">© 2023 Orumi. All rights reserved.</p>
        </div>
      </footer>

      {/* 로딩 오버레이 */}
      {loading && (
        <div className="loading-overlay" role="status" aria-live="polite">
          <div className="spinner" aria-hidden="true" />
          <p className="loading-text">결과를 준비하고 있어요…</p>
        </div>
      )}

      {/* 토스트 */}
      {toast.open && (
        <div className={`toast ${toast.type === "error" ? "toast--error" : "toast--success"}`}>
          <span className="toast__icon" aria-hidden>⏳</span>
          <span className="toast__msg">{toast.message}</span>
          <button
            type="button"
            className="toast__close"
            onClick={() => setToast((t) => ({ ...t, open: false }))}
            aria-label="닫기"
          >
            ×
          </button>
        </div>
      )}

      {/* ✅ 결과 모달 (X로 닫기 / 백드롭 클릭 / ESC로 닫기) */}
      {isResultOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsResultOpen(false)}
        >
          <div
            className="modal-panel result-modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close"
              aria-label="닫기"
              title="닫기"
              onClick={() => setIsResultOpen(false)}
            >
              ×
            </button>

            <div className="modal-body">
              <ResultCard
                initialTitle={resultData.title}
                initialDescription={resultData.description}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
