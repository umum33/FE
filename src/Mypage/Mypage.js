import React from "react";
import "./Mypage.css";
import Homeback from "../Homeback/Homeback";
import Header from "../Header/Header";

function Modal({ open, onClose, title = "Full content", actions, children }) {
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
            {actions}
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

  const [selectedRow, setSelectedRow] = React.useState(null);
  const [selectedPost, setSelectedPost] = React.useState(null);
  const [reviewHistory, setReviewHistory] = React.useState([]);
  const [productHistory, setProductHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

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

  const handleCopy = async (textToCopy) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      alert("복사되었습니다!");
    } catch (err) {
      alert("복사에 실패했습니다.");
    }
  };

  const openRow = (review, reply, date) => {
    setSelectedRow({ review, reply, date });
  };

  return (
    <div className="page-root" style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}>
      <Header />
      <Homeback />
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
                  <col style={{ width: "35%" }} />
                  <col style={{ width: "45%" }} />
                  <col style={{ width: "12%" }} />
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
                    const CellBtn = ({ text, label }) => (
                      <button
                        type="button"
                        className="ellipsis-trigger cell-trigger"
                        onClick={() => setSelectedRow(item)}
                        title="눌러서 전체 내용 확인"
                      >
                        {text}
                      </button>
                    );
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
                            title="눌러서 전체 내용 확인"
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

          <h2 className="section-title with-icon">
            <span className="section-icon" aria-hidden="true">🛍️</span>
            내가 생성한 상품글 내역
          </h2>

          <div className="table-card">
            <div className="card-scroll">
              <table className="table-fixed">
                <colgroup>
                  <col style={{ width: "35%" }} />
                  <col style={{ width: "45%" }} />
                  <col style={{ width: "12%" }} />
                </colgroup>
                <thead>
                  <tr>
                    <th>상품글 제목</th>
                    <th>본문</th>
                    <th className="th-right">생성 날짜</th>
                  </tr>
                </thead>
                <tbody>
                  {productHistory.map((item, i) => {
                    const CellBtn = ({ text, label }) => (
                      <button
                        type="button"
                        className="ellipsis-trigger cell-trigger"
                        onClick={() => setSelectedPost(item)}
                        title="눌러서 전체 내용 확인"
                      >
                        {text}
                      </button>
                    );
                    const { generatedTitle, generatedDescription, createdAt } = item;
                    const date = new Date(createdAt).toLocaleDateString();
                    return (
                      <tr key={item.historyId || i}>
                        <td><CellBtn text={generatedTitle} label="Title" /></td>
                        <td><CellBtn text={generatedDescription} label="Description" /></td>
                        <td className="td-right">
                          <button
                            type="button"
                            className="date-trigger"
                            onClick={() => setSelectedPost(item)}
                            title="눌러서 전체 내용 확인"
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

          <Modal
            open={!!selectedRow}
            onClose={() => setSelectedRow(null)}
            title="📜 리뷰 및 답글 상세"
            actions={
              <button className="modal-copy-button" onClick={() => handleCopy(selectedRow?.generatedReply)}>
                전체 복사
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
            title="📜 상품글 상세"
            actions={
              <button className="modal-copy-button" onClick={() => handleCopy(`${selectedPost?.generatedTitle}\n\n${selectedPost?.generatedDescription}`)}>
                전체 복사
              </button>
            }
          >
            {selectedPost && (
              <div>
                <div className="modal-content-section">
                  <h4 className="post-label">상품글 제목</h4>
                  <div className="post-text">{selectedPost.generatedTitle}</div>
                </div>
                <div className="modal-content-section">
                  <h4 className="post-label">본문</h4>
                  <div className="post-text">{selectedPost.generatedDescription}</div>
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