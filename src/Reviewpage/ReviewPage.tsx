import React, { useState } from "react";
import "./ReviewPage.css";
import Homeback from "../Homeback/Homeback";
import Header from "../Header/Header";

export default function ReviewPage() {
  const [generatedResponse, setGeneratedResponse] = useState("");

  const PasteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    </svg>
  );

  const ToneIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20z"></path>
      <path d="M12 6v6l4 2"></path>
    </svg>
  );

  const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );

  const handleCopy = () => {
    if (generatedResponse) {
      navigator.clipboard.writeText(generatedResponse)
        .then(() => {
          alert("응답이 복사되었습니다!");
        })
        .catch(err => {
          console.error("복사 실패:", err);
          alert("복사 실패. 다시 시도해 주세요.");
        });
    } else {
      alert("생성된 응답이 없습니다.");
    }
  };

  const handleGenerate = () => {
    setGeneratedResponse("AI가 생성한 응답입니다. 고객님, 소중한 시간을 내어 좋은 후기를 남겨주셔서 진심으로 감사드립니다.");
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}>
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <Homeback />

        {/* Main Content */}
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <h1 className="page-title">리뷰응답 생성하기</h1>
                <p className="subtitle">오름이와 함께 쉽고 간편하게 리뷰를 생성할 수 있습니다</p>
              </div>
            </div>

            {/* 가로형 컨테이너 */}
            <div className="horizontal-container">
              {/* Original Review */}
              <div className="input-section">
                <label className="form-label">
                  <p className="label-text">고객 리뷰</p>
                  <textarea className="textarea"></textarea>
                </label>
                {/* 👇 어조 선택 & 생성 버튼을 이 컨테이너 안으로 이동 */}
                <div className="controls-group">
                  <div className="select-container">
                    <label className="form-label">
                      <p className="label-text">응답 어조 선택</p>
                      <select className="select">
                        <option value="one">친절한 어조</option>
                        <option value="two">전문적인 어조</option>
                        <option value="three">유쾌한 어조</option>
                      </select>
                    </label>
                  </div>
                  <button className="btn-generate" onClick={handleGenerate}>
                    <span className="truncate">생성버튼</span>
                  </button>
                </div>
                {/* 👆 수정된 부분 */}
              </div>

              {/* AI-Generated Response */}
              <div className="input-section">
                <label className="form-label">
                  <p className="label-text">생성된 응답</p>
                  <textarea
                    className="textarea"
                    value={generatedResponse}
                    readOnly
                  ></textarea>
                </label>
                {/* 👇 복사하기 버튼을 이 컨테이너 안으로 이동 */}
                <div className="controls-group">
                  <button className="btn-copy" onClick={handleCopy}>
                    <span className="truncate">복사하기</span>
                  </button>
                </div>
                {/* 👆 수정된 부분 */}
              </div>
            </div>

          </div>
        </div>

        {/* '이렇게 사용해 보세요!' 섹션 */}
        <div className="flex justify-center p-5 how-to-section">
          <div className="max-w-[960px] flex-1">
            <h2 className="how-to-title">
              이렇게 사용해 보세요!
            </h2>
            <div className="how-to-steps-container">
              <div className="how-to-step">
                <div className="how-to-icon">
                  <PasteIcon />
                </div>
                <h3 className="how-to-step-title">1. 리뷰 복사</h3>
                <p className="how-to-step-description">응답할 리뷰를 복사하여 좌측 입력창에 붙여넣으세요.</p>
              </div>
              <div className="how-to-step">
                <div className="how-to-icon">
                  <ToneIcon />
                </div>
                <h3 className="how-to-step-title">2. 어조 선택 및 생성</h3>
                <p className="how-to-step-description">원하는 응답 어조를 선택하고 생성 버튼을 누르세요.</p>
              </div>
              <div className="how-to-step">
                <div className="how-to-icon">
                  <CopyIcon />
                </div>
                <h3 className="how-to-step-title">3. 응답 복사</h3>
                <p className="how-to-step-description">생성된 응답을 복사하여 자유롭게 사용하세요.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}