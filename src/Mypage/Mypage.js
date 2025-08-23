import React from "react";
import "./Mypage.css";
import Homeback from "../Homeback/Homeback";
import Header from "../Header/Header";

/* ---------------- Modal (그대로 사용) ---------------- */
function Modal({ open, onClose, title = "Full content", actions, children }) { // actions prop 추가
  React.useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <div className="modal-actions">
            {actions} {/* 여기에 주황색 버튼이 들어옵니다 */}
            <button className="modal-close" onClick={onClose} aria-label="Close dialog">✕</button>
          </div>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Mypage() {
  const today = new Date();
  const dateText = today.toLocaleDateString("ko-KR", {
    year: "numeric", month: "long", day: "2-digit",
  });

  // ✅ 행 단위 선택 상태
  const [selectedRow, setSelectedRow] = React.useState(null);

  // ✅ 상품글 행 선택 상태
  const [selectedPost, setSelectedPost] = React.useState(null);

  // 서버에서 받아올 데이터를 위한 state
  const [reviewHistory, setReviewHistory] = React.useState([]);
  const [productHistory, setProductHistory] = React.useState([]);

 
  
  // 로딩 및 에러 상태를 위한 state
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // 페이지 처음 열릴 때 서버에 데이터 요청
    React.useEffect(() => {
      const fetchHistory = async () => {
        try {
          const response = await fetch('/api/history');
          if (!response.ok) {
            throw new Error('데이터를 불러오는 데 실패했습니다.');
          }
          const data = await response.json();
          setReviewHistory(data.reviewHistory);
          setProductHistory(data.productHistory);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
  
      fetchHistory();
    }, []);
  




  //복사 함수
  const handleCopy = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      alert("클립보드에 복사되었습니다!");
    } catch (err) {
      alert("복사에 실패했습니다.");
    }
  };
  // ✅ 셀 클릭 시 같은 핸들러로 행 모달 오픈
  const openRow = (review, reply, date) => {
    setSelectedRow({ review, reply, date });
  };

  return (
    <div className="page-root"   style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}>
      {/* Header */}
     <Header />
     <Homeback />
      {/* 스크롤 영역 */}
      <div className="content-scroll">
        <div className="container">
          <div className="greeting">
            <div className="greeting-text">
              <p className="hello-text">안녕하세요, 사자님!</p>
              <p className="hello-sub">{dateText}</p>
            </div>
          </div>

          <h2 className="section-title with-icon">
            <span className="section-icon" aria-hidden="true">💬</span>
            내가 작성한 답글 내역
          </h2>

          <div className="table-card">
            <div className="card-scroll">
              <table className="table-fixed">
                <colgroup>
                  <col />{/* Review */}
                  <col />{/* Reply */}
                  <col style={{ width: "140px" }} />{/* Date */}
                </colgroup>
                <thead>
                  <tr>
                    <th>리뷰 내용</th>
                    <th>내 답글</th>
                    <th className="th-right">생성 날짜</th>
                  </tr>
                </thead>

                <tbody>
                  {reviewHistory.map((item, i) => {
                    // ✅ 셀 공통 렌더러 (미리보기 + 클릭→모달)
                    const CellBtn = ({ text, label }) => (
                      <button
                        type="button"
                        className="ellipsis-3 ellipsis-trigger cell-trigger"
                        onClick={() => setSelectedRow(item)} // 전체 item 객체를 state에 저장
                        aria-label={`${label}: 모달로 전체 보기`}
                        title="Click to view full review & reply"
                      >
                        {text}
                      </button>
                    );

                    // API 응답 데이터에 맞게 변수 이름 변경
                    const { reviewText, generatedReply, createdAt } = item;
                    const date = new Date(createdAt).toLocaleDateString();

                    return (
                      <tr key={i}>
                        <td><CellBtn text={reviewText} label="Review" /></td>
                        <td><CellBtn text={generatedReply} label="Reply" /></td>
                        <td className="td-right">
                          <button
                            type="button"
                            className="date-trigger"
                            onClick={() => setSelectedRow(item)}
                            title="View full review & reply"
                          >
                            {date}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* 섹션 2: 생성된 상품글 (카드 자체 스크롤 + 날짜 고정폭) */}
          <h2 className="section-title with-icon">
            <span className="section-icon" aria-hidden="true">🛍️</span>
            내가 생성한 상품글 내역
          </h2>

          <div className="table-card">
            <div className="card-scroll">
              <table className="table-fixed">
                <colgroup>
                  <col />{/* Title */}
                  <col style={{ width: "140px" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>상품글 제목</th>
                    <th className="th-right">생성 날짜</th>
                  </tr>
                </thead>
                <tbody>
                  {productHistory.map((item, i) => {
                    const { generatedTitle, createdAt } = item;
                    const date = new Date(createdAt).toLocaleDateString();
                    return (
                      <tr key={i}>
                        <td>
                          <button
                            type="button"
                            className="ellipsis-3 ellipsis-trigger cell-trigger"
                            onClick={() => setSelectedPost(item)} // 전체 item 객체를 state에 저장
                            aria-label="Product title: view full"
                          >
                            {generatedTitle}
                          </button>
                        </td>
                        <td className="td-right">
                          <button
                            type="button"
                            className="date-trigger"
                            onClick={() => setSelectedPost(item)}
                            aria-label="Product date: view"
                          >
                            {date}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>




          {/* ✅ 행 단위 모달: 리뷰 + 응답 + 날짜 같이 표기 */}
          <Modal
            open={!!selectedRow}
            onClose={() => setSelectedRow(null)}
            title="📜 리뷰 및 답글 상세"
            actions={
              <button className="modal-copy-button" onClick={() => handleCopy(selectedRow?.generatedReply)}>
                 Copy
              </button>
            }
          >
            {selectedRow && (
              <div>
                <div className="modal-content-section">
                  <h4 className="post-label">리뷰 내용</h4>
                  <div className="post-text">{selectedRow.reviewText}</div>
                </div>
                <div className="modal-content-section">
                  <h4 className="post-label">내 답글</h4>
                  <div className="post-text">{selectedRow.generatedReply}</div>
                </div>
                <div className="post-meta">
                  작성일: <strong>{new Date(selectedRow.createdAt).toLocaleDateString()}</strong>
                </div>
                
              </div>
            )}
          </Modal>


          <Modal
            open={!!selectedPost}
            onClose={() => setSelectedPost(null)}
            title="상품글 상세"
            actions={
              <button className="modal-copy-button" onClick={() => handleCopy(selectedPost?.generatedTitle)}>
                Copy
              </button>
            }
          >
            {selectedPost && (
              <div>
                <div className="modal-content-section">
                  <h4 className="post-label">상품글 제목</h4>
                  <div className="post-text">{selectedPost.generatedTitle}</div>
                </div>
                <div className="post-meta">
                  작성일: <strong>{new Date(selectedPost.createdAt).toLocaleDateString()}</strong>
                </div>
              </div>
            )}
          </Modal>

        </div>
          <footer className="footer">
            <p>© {new Date().getFullYear()} Orumi. All rights reserved.</p>
          </footer>
      </div>
    </div>
  );
}
