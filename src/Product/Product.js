import "./Product.css";
import React, { useState, useRef, useEffect } from "react";
import Homeback from "../Homeback/Homeback";
import Header from "../Header/Header";

function ResultCard({
  initialTitle = "",
  initialDescription = "",
  onClose,
  ...props
}) {
  const [title] = useState(initialTitle);
  const [description] = useState(initialDescription);

  const handleCopy = async () => {
    const text = `${title ? title + "\n\n" : ""}${description || ""}`;
    try {
      await navigator.clipboard.writeText(text);
      alert("상품글이 복사되었습니다!");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("상품글이 복사되었습니다!");
    }
  };

  return (
    <section className="rv-card" {...props}>
      <div className="rv-actions rv-actions--left">
        <button
          type="button"
          className="rv-btn rv-btn-ghost"
          onClick={handleCopy}
          title="Copy title & description"
        >
          전체 복사
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
        <h1 className="rv-title">생성된 상품글</h1>
        <p className="rv-sub">
          생성된 제목과 본문을 확인해주세요.
          위쪽 버튼을 사용해 복사하거나 닫을 수 있습니다.
        </p>
      </header>

      <div className="rv-divider" />

      <div className="rv-fields">
        <div className="rv-field">
          <label htmlFor="rv-title-input" className="rv-label">상품글 제목</label>
          <textarea
            id="rv-title-input"
            rows={2}
            className="rv-textarea rv-textarea--compact"
            placeholder="e.g., Fresh Organic Apples from Local Orchard"
            value={title}
            readOnly
            style={{ pointerEvents: "none" }}
          />
        </div>

        <div className="rv-field">
          <label htmlFor="rv-desc-input" className="rv-label">본문</label>
          <textarea
            id="rv-desc-input"
            rows={8}
            className="rv-textarea"
            placeholder="Write or edit the generated description here…"
            value={description}
            readOnly
            style={{ pointerEvents: "none" }}
          />
        </div>
      </div>
    </section>
  );
}

export default function Product() {
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState("");

  const [isResultOpen, setIsResultOpen] = useState(false);
  const [resultData, setResultData] = useState({ title: "", description: "" });

  const [recInit, setRecInit] = useState(false);
  const streamRef = useRef(null);
  const [recording, setRecording] = useState(false);

  const [audioURL, setAudioURL] = useState("");
  const recorderRef = useRef(null);
  const [showRecordBar, setShowRecordBar] = useState(false);
  const audioChunksRef = useRef([]);

  const recognitionRef = useRef(null);
  const [sttActive, setSttActive] = useState(false);
  const [sttText, setSttText] = useState("");
  const lastPayloadRef = useRef(null);

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

  const [toast, setToast] = useState({ open: false, type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ open: true, type, message });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 2000);
  };

  const openResultModal = async () => {
    if ((!keywords || !keywords.trim()) && !audioURL) {
      showToast("error", "키워드를 입력하거나 음성 입력을 해주세요.");
      return;
    }
    try {
      setLoading(true);

      const sttFinalForPayload = (sttText || "").trim();
      const keywordsTrimForPayload = (keywords || "").trim();

      let finalInput = "";

      if (sttFinalForPayload) {
        finalInput = sttFinalForPayload;
      } else if (keywordsTrimForPayload) {
        finalInput = keywordsTrimForPayload;
      }

      const payload = {
        productInfo: finalInput,
      };
      lastPayloadRef.current = payload;

      const response = await fetch('/api/v1/products/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("상품글 생성에 실패했어요. 다시 시도해 주세요.");
      }

      const responseData = await response.json();

      if (responseData.success && responseData.data) {
        const { generatedTitle, generatedDescription } = responseData.data;
        setResultData({ title: generatedTitle, description: generatedDescription });
        setIsResultOpen(true);
      } else {
        throw new Error(responseData.error || "알 수 없는 오류가 발생했어요.");
      }

    } catch (err) {
      showToast("error", err?.message || "문제가 발생했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  function pickSupportedMime() {
    const cands = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", ""];
    for (const m of cands) {
      if (!m) return "";
      if (MediaRecorder.isTypeSupported?.(m)) return m;
    }
    return "";
  }

  const startRecording = async () => {
    if (recInit || recording) return;
    setRecInit(true);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }

      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = pickSupportedMime();
      const rec = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        try {
          const blobType = mimeType || "audio/webm";
          const blob = new Blob(audioChunksRef.current, { type: blobType });
          const url = URL.createObjectURL(blob);
          setAudioURL(url);
          showToast("success", "녹음이 완료되었습니다. 버튼을 눌러 새로 녹음할 수 있습니다.");
        } finally {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
          }
          setRecording(false);
          setShowRecordBar(false);
        }
      };

      rec.start();
      recorderRef.current = rec;
      setRecording(true);
      setShowRecordBar(true);
    } catch (err) {
      console.error(err);
      showToast("error", "마이크 권한을 허용해 주세요.");
      setShowRecordBar(false);
    } finally {
      setRecInit(false);
    }
  };

  const stopRecording = () => {
    const rec = recorderRef.current;
    if (rec && rec.state !== "inactive") {
      rec.stop();
    }
  };

  function initSpeechRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.lang = "ko-KR";
    rec.interimResults = true;
    rec.continuous = true;

    rec.onresult = (e) => {
      let f = "";
      for (let idx = e.resultIndex; idx < e.results.length; idx++) {
        const r = e.results[idx];
        if (r.isFinal) f += r[0].transcript;
      }
      if (f) setSttText((p) => (p ? `${p} ${f}` : f));
    };

    rec.onerror = () => { setSttActive(false); };
    rec.onend = () => { if (sttActive) { try { rec.start(); } catch { } } };

    recognitionRef.current = rec;
    return rec;
  }

  function startSTT() {
    if (sttActive) return;
    const rec = recognitionRef.current || initSpeechRecognition();
    if (!rec) return;
    setSttText("");
    setSttActive(true);
    try { rec.start(); } catch { }
  }

  function stopSTT() {
    setSttActive(false);
    try { recognitionRef.current?.stop(); } catch { }
  }

  useEffect(() => {
    if (recording) startSTT();
    else stopSTT();
  }, [recording]);

  return (
    <div className="app" aria-busy={loading} style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}>
      <Header />
      <Homeback />

      <main>
        <section className="container hero" aria-label="등록 방식 선택">
          <div className="hero__text">
            <h2 className="hero__title">어떤 방법으로 상품 글을 생성하시겠습니까?</h2>
            <p className="hero__sub">키워드를 입력하거나 녹음을 한 후, 결과 보기 버튼을 누르면 상품 글이 생성됩니다.</p>
          </div>
        </section>

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
                  placeholder="예: 청도 감, 당도 높음, 오늘 수확"
                  rows={7}
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  disabled={!!audioURL}
                />
              </form>
            </div>

            <div className="card-icon-box card-icon-box--text">
              <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%"
              }}>
                <button
                  type="button"
                  className={`voice-icon-wrapper${recording ? " recording" : ""}`}
                  aria-label="녹음 시작/중지"
                  title="녹음 시작/중지"
                  disabled={recInit || keywords.trim().length > 0} aria-busy={recInit ? "true" : "false"}
                  onClick={recording ? stopRecording : startRecording}
                  style={{ marginBottom: "0px" }}
                >
                  {!recording && !recInit && (
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
                  )}
                  {recording ? "녹음 중…" : (recInit ? "준비 중…" : "")}
                </button>
                <div style={{
                  minHeight: "24px",
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}>
                  {(!audioURL) ? (
                    <p className="ibox-sub">
                      음성으로 말하면 자동으로 글을 만들어 드립니다. <br></br>버튼을 누르면 녹음이 시작/중지 됩니다.
                    </p>
                  ) : null}
                </div>

                <div style={{
                  width: "70%",
                }}>
                  {audioURL && (
                    <audio controls src={audioURL} />
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="cta">
            <div className="container">
              <button
                type="button"
                className="cta-button"
                onClick={openResultModal}
                disabled={loading}
              >
                결과 보기
              </button>
            </div>
          </section>

        </div>
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <p className="footer__copy">© 2023 Orumi. All rights reserved.</p>
        </div>
      </footer>

      {loading && (
        <div className="loading-overlay" role="status" aria-live="polite">
          <div className="spinner" aria-hidden="true" />
          <p className="loading-text">결과를 준비하고 있어요…</p>
        </div>
      )}

      {toast.open && (
        <div className={`toast ${toast.type === "error" ? "toast--error" : "toast--success"}`}>
          <span className="toast__icon" aria-hidden>⏳</span>
          <span className="toast__msg">{toast.message}</span>
        </div>
      )}

      {isResultOpen && (
        <div
          className="modal-backdrop"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsResultOpen(false)}
        >
          <ResultCard
            onClick={(e) => e.stopPropagation()}
            onClose={() => setIsResultOpen(false)}
            initialTitle={resultData.title}
            initialDescription={resultData.description}
          />
        </div>
      )}
    </div>
  );
}