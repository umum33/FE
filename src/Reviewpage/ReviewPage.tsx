import React, { useState } from "react";
import axios from 'axios';
import "./ReviewPage.css";
import Homeback from "../Homeback/Homeback";
import Header from "../Header/Header";

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

const SpinnerIcon = () => (
  <svg
    className="spinner"
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
  </svg>
);

const toneMapping = {
  "친절한 어조": "POLITE",
  "전문적인 어조": "PROFESSIONAL",
  "유쾌한 어조": "FUNNY",
};


export default function ReviewPage() {
  const [reviewText, setReviewText] = useState("");
  const [generatedResponse, setGeneratedResponse] = useState("");
  const [selectedTone, setSelectedTone] = useState("친절한 어조");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleGenerate = async () => {

    setIsLoading(true);

    try {
      const apiEndpoint = '/api/v1/reviews/generate';

      const reviewStyle = toneMapping[selectedTone as keyof typeof toneMapping];

      const requestBody = {
        reviewText: reviewText,
        reviewStyle: reviewStyle
      };

      const response = await axios.post(apiEndpoint, requestBody);

      if (response.data.success) {
        setGeneratedResponse(response.data.data.generatedReply);
      } else {
        console.error("API 응답 오류:", response.data.error);
        alert("응답 생성에 실패했습니다. " + response.data.error);
      }
    } catch (error) {
      console.error("API 통신 중 오류가 발생했습니다:", error);
      alert("서버 연결에 실패했습니다. CORS 설정 또는 URL을 확인해주세요.");
    }finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}>
        {isLoading && ( <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-lg">
              <SpinnerIcon />
              <span>로딩 중...</span>
              </div>
              </div>
            )}
      <div className="layout-container flex h-full grow flex-col">
        <Header />
        <Homeback />

        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex-col justify-between max-w-[960px] flex-1 gap-3">
            <div className="flex flex-col gap-3">
                <h1 className="page-title">리뷰응답 생성하기</h1>
                <p className="subtitle">오름이와 함께 쉽고 간편하게 리뷰를 생성할 수 있습니다</p>
            </div>

            <div className="horizontal-container">
              <div className="input-section">
                <label className="form-label">
                  <p className="label-text">고객 리뷰</p>
                  <textarea
                  className="textarea"
                  value={reviewText}
                  onChange = {(e) => setReviewText(e.target.value)}>
                  </textarea>
                </label>
                <div className="controls-group flex justify-between items-end ">
                  <div className="select-container">
                    <label className="form-label">
                      <select className="select"
                      value={selectedTone}
                      onChange={(e)=> setSelectedTone(e.target.value)}>
                        <option value="친절한 어조">친절한 어조</option>
                        <option value="전문적인 어조">전문적인 어조</option>
                        <option value="유쾌한 어조">유쾌한 어조</option>
                      </select>
                    </label>
                  </div>
                  <button className="btn-generate" onClick={handleGenerate} disabled={isLoading}>
                     <span className="truncate">생성버튼</span>
                  </button>
                </div>
              </div>

              <div className="input-section flex-1">
                <label className="form-label">
                  <p className="label-text">생성된 응답</p>
                  <textarea
                    className="textarea"
                    value={generatedResponse}
                    readOnly
                  ></textarea>
                </label>
                <div className="controls-group">
                  <button className="btn-copy" onClick={handleCopy}>
                    <span className="truncate">복사하기</span>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="flex justify-center p-5 how-to-section from-orange-800 to-red-700" >
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
         <footer className="flex justify-center">
             <div className="flex max-w-[960px] flex-1 flex-col">
               <div className="flex flex-col gap-6 px-5 py-10 text-center @container">
                 <p className="text-[#8a7260] text-base font-normal leading-normal">© 2025 Orumi. All rights reserved.</p>
               </div>
             </div>
           </footer>
      </div>
    </div>
  );
}