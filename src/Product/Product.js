import "./Product.css";
import React, { useState, useRef, useEffect } from "react";
import Homeback from "../Homeback/Homeback";
import Header from "../Header/Header";


/** Result 카드 UI  */
function ResultCard({ //매개변수
  initialTitle = "",
  initialDescription = "",
  onClose,           // 닫기 핸들러 함수
  ...props           // 나머지 전달용
}) {
  const [title] = useState(initialTitle); // [현재값, 값바꾸는 함수] = useState(초기값);
  const [description] = useState(initialDescription);

  const handleCopy = async () => { // 텍스트를 클립보드에 복사하는 비동기 함수
    const text = `${title ? title + "\n\n" : ""}${description || ""}`; // 최종 복사되는 텍스트
    try { // 클립보드 API 사용
      await navigator.clipboard.writeText(text); //텍스트를 클립보드에 기록 (await는 비동기 함수에서 사용, 이 함수가 완료될 때까지 기다림)
    } catch { // 클립보드 API가 지원되지 않는 경우(예외처리) 
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta); // 텍스트 영역 생성
      ta.select(); //텍스트 전부 선택
      document.execCommand("copy"); //선택 영역 복사
      document.body.removeChild(ta); // 텍스트 영역 제거
      alert("Copied to clipboard!"); // 성공알림
    }
  };




  return (

    <section className="rv-card" {...props}>
      <div className="rv-actions rv-actions--left">
        <button
          type="button"
          className="rv-btn rv-btn-ghost"
          onClick={handleCopy} // 클릭하면 handleCopy 함수 실행
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
            readOnly // 수정 불가
            style={{ pointerEvents: "none" }}

          //onChange={(e) => setTitle(e.target.value)} // 입력값 변경 시 상태 업데이트
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
            readOnly // 수정 불가
            style={{ pointerEvents: "none" }}

          //onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
}

export default function Product() {
  const [loading, setLoading] = useState(false);
  const [keywords, setKeywords] = useState("");

  // 결과 모달 상태
  const [isResultOpen, setIsResultOpen] = useState(false);
  const [resultData, setResultData] = useState({ title: "", description: "" });

  // 음성 녹음 상태  
  const [recInit, setRecInit] = useState(false);
  const streamRef = useRef(null);
  const [recording, setRecording] = useState(false);

  const [audioURL, setAudioURL] = useState("");
  const recorderRef = useRef(null);
  const [showRecordBar, setShowRecordBar] = useState(false); // 녹음바 UI 상태
  const audioChunksRef = useRef([]); // audioChunks를 ref로 관리

  // ⬇️ [추가] STT & 페이로드 보관
  const recognitionRef = useRef(null);     // Web Speech 인스턴스
  const [sttActive, setSttActive] = useState(false);
  const [sttText, setSttText] = useState("");       // 확정 인식 결과 누적
  const lastPayloadRef = useRef(null);               // 마지막 백엔드 전송 페이로드 저장

  // 모달 열릴 때 배경 스크롤 잠금 + ESC 닫기
  useEffect(() => {
    if (!isResultOpen) return;
    const prev = document.body.style.overflow; //현재 body overflow 저장
    document.body.style.overflow = "hidden"; //모달 열리면 body 스크롤 잠금
    const onKey = (e) => e.key === "Escape" && setIsResultOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev; // 복원
      document.removeEventListener("keydown", onKey); // 이벤트 리스너 제거 
    };
  }, [isResultOpen]); // 의존성 : 모달 열릴 때마다 실행


  // 토스트 상태
  const [toast, setToast] = useState({ open: false, type: "", message: "" });

  const showToast = (type, message) => {
    setToast({ open: true, type, message });
    setTimeout(() => setToast((t) => ({ ...t, open: false })), 2000);
  };

  const openResultModal = async () => {
    // 키워드와 음성파일이 모두 없으면 토스트 표시 후 함수 종료
    if ((!keywords || !keywords.trim()) && !audioURL) {
      showToast("error", "키워드를 입력하거나 음성 입력을 해주세요.");
      return;
    }
    try {
      setLoading(true);

      // 백엔드에게 전송할 건 둘 중에 하나
      const sttFinalForPayload = (sttText || "").trim();
      const keywordsTrimForPayload = (keywords || "").trim();

      let finalInput = "";
      

      // 1순위: 음성 녹음 결과(sttText)가 있으면 그것을 사용
      if (sttFinalForPayload) {
        finalInput = sttFinalForPayload;
      }
      // 2순위: 키워드가 있으면 그것을 사용
      else if (keywordsTrimForPayload) {
        finalInput = keywordsTrimForPayload;
      }

      const payload = {
      productInfo: finalInput, // 키를 'productInfo'로 통일
    };
    lastPayloadRef.current = payload; // 필요시 마지막 요청 보관

    // console.log("전송 직전 payload:", payload);
    
    const response = await fetch('/api/v1/products/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // 서버에서 2xx 상태 코드가 아닌 응답을 보냈을 때 에러 처리
      throw new Error("상품글 생성에 실패했어요. 다시 시도해 주세요.");
    }

    const responseData = await response.json(); //서버가 보낸 내용 확인
    
    //데이터 추출
    if (responseData.success && responseData.data) {
      const { generatedTitle, generatedDescription } = responseData.data;
      setResultData({ title: generatedTitle, description: generatedDescription });
      setIsResultOpen(true);
    } else {
      // 성공했지만 데이터가 없는 경우 등 예외 처리
      throw new Error(responseData.error || "알 수 없는 오류가 발생했어요.");
    }
      
    } catch (err) {
      showToast("error", err?.message || "문제가 발생했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  // 음성 녹음

  function pickSupportedMime() {
    const cands = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", ""];
    for (const m of cands) {
      if (!m) return "";
      if (MediaRecorder.isTypeSupported?.(m)) return m;
    } return "";
  }



  const startRecording = async () => {
    if (recInit || recording) return; // 이미 녹음 중이거나 초기화 중이면 아무것도 안 함 (중복 클릭 방지)
    setRecInit(true);
    try {
      if (streamRef.current) { // 이전 스트림이 있다면
        streamRef.current.getTracks().forEach(t => t.stop()); // 모든 트랙 중지
        streamRef.current = null; // 스트림 초기화
      }

      audioChunksRef.current = []; // 녹음 시작 전 초기화!

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // 마이크 권한 요청
      streamRef.current = stream;

      const mimeType = pickSupportedMime();
      const rec = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

      rec.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data); //데이터 조각 생길 때마다 버퍼에 추가
      };
      rec.onstop = () => { // 녹음이 중지되면
        try {
          const blobType = mimeType || "audio/webm"; // 기본값은 webm
          const blob = new Blob(audioChunksRef.current, { type: blobType });
          const url = URL.createObjectURL(blob);
          setAudioURL(url);
          showToast("success", "녹음이 완료되었습니다."); // 토스트로 안내
        } finally {
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
          } // 스트림 초기화
          setRecording(false);
          setShowRecordBar(false);
        }
      };

      rec.start(); // 실제 녹음 시작
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
    // setRecording(false)는 onstop에서 처리
  };

  // ⬇️ [추가] STT 초기화/시작/정지 + 녹음 상태에 맞춰 자동 동기화
  function initSpeechRecognition() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.lang = "ko-KR";
    rec.interimResults = true;  // 실시간 정확도에 도움 (우리는 확정만 반영)
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
    setSttText(""); // 새 세션 시작 시 초기화
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recording]);

  return ( // 실제 UI 렌더링
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
                  disabled={!!audioURL} // 음성 입력이 있으면 키워드 입력 비활성화
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
                  disabled={recInit || keywords.trim().length > 0} aria-busy={recInit ? "true" : "false"} // 녹음 중이면 버튼 & 키워드 입력 비활성화
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
                  {(!audioURL || recording || recInit) ? (
                    <p className="ibox-sub">
                      말하면 텍스트로 변환해 글을 만들어 드립니다.
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
          {/* CTA */}
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
