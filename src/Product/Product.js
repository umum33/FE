import "./Product.css";
import React, { useState, useRef, useEffect } from "react";
import Header from "../Header/Header";
import Homeback from "../Homeback/Homeback";

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
  onClose,           // ← 부모에서 닫기 핸들러 주입
  ...props           // ← onClick(e.stopPropagation) 전달용
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
    <section className="rv-card" {...props}>
      {/* 상단 좌측 액션 (Copy ←, 그 오른쪽에 닫기) */}
      <div className="rv-actions rv-actions--left">
        <button
          type="button"
          className="rv-btn rv-btn-ghost"
          onClick={handleCopy}
          title="Copy title & description"
        >
          📋 Copy
        </button>
        <button
          type="button"
          className="rv-btn rv-btn-ghost"
          onClick={onClose}
          title="닫기"
          aria-label="닫기"
        >
          ✕ 닫기
        </button>
      </div>

      <header className="rv-header">
        <h1 className="rv-title">Generated Product Description</h1>
        <p className="rv-sub">
          Review and edit your title and description. Use the top buttons to copy or close.
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
      // ✅ 성공 토스트 제거 (생성 완료 팝업 안 띄움)
      setIsResultOpen(true);
    } catch (err) {
      // 실패만 토스트 표시
      showToast("error", err?.message || "문제가 발생했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app" aria-busy={loading}  style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}>
      {/* Header */}
       <Header />
       <Homeback />

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
                  </svg>
                  <label className="ibox-label" htmlFor="keywordInput">키워드 입력</label>
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

      {/* 토스트 (오류만 표시) */}
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

      {/* ✅ 결과 모달: 백드롭 + 카드만 (가장 큰 박스 제거) */}
      {isResultOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsResultOpen(false)}
        >
          <ResultCard
            onClick={(e) => e.stopPropagation()}      // 카드 내부 클릭은 닫힘 방지
            onClose={() => setIsResultOpen(false)}     // 닫기 버튼
            initialTitle={resultData.title}
            initialDescription={resultData.description}
          />
        </div>
      )}
    </div>
  );
}
