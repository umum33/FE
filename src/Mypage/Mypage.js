import React from "react";
import "./Mypage.css";
import Header from "../Header/Header";
import Homeback from "../Homeback/Homeback";


/* ---------------- Modal (그대로 사용) ---------------- */
function Modal({ open, onClose, title = "Full content", children }) {
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
          <button className="modal-close" onClick={onClose} aria-label="Close dialog">✕</button>
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
  const dateText = today.toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "2-digit",
  });

  // ✅ 행 단위 선택 상태
  const [selectedRow, setSelectedRow] = React.useState(null);

  // ✅ 테이블 데이터 (그대로)

  // ✅ 상품글 행 선택 상태
  const [selectedPost, setSelectedPost] = React.useState(null);

  // ✅ 상품글 데이터
  const productRows = [
    ["Fresh Organic Apples from Local Orchard", "2024-07-22"],
    ["Handcrafted Wooden Cutting Boards", "2024-07-19"],
    ["Artisan Cheeses from Family Farm", "2024-07-16"],
    ["Homemade Jams and Preserves", "2024-07-13"],
    ["Sustainable Bamboo Toothbrushes", "2024-07-11"],
    ["Fresh Organic Apples from Local Orchard", "2024-07-22"],
    ["Handcrafted Wooden Cutting Boards", "2024-07-19"],
    ["Artisan Cheeses from Family Farm", "2024-07-16"],
    ["Homemade Jams and Preserves", "2024-07-13"],
    ["Sustainable Bamboo Toothbrushes", "2024-07-11"],
  ];

  const reviewRows = [
    [
      "This product is amazing! The quality is top-notch, and it arrived quickly. I highly recommend it to anyone looking for a reliable option.",
      "Thank you so much for your positive feedback! We're thrilled to hear you're enjoying the product. Your satisfaction is our priority.",
      "2024-07-20",
    ],
    [
      "The item was not as described. It was smaller than expected and the color was off. Disappointed with this purchase.",
      "We apologize for the discrepancy. Please contact our support team for a return or exchange. We value your feedback and will address this issue.",
      "2024-07-18",
    ],
    [
      "Absolutely love this! It's exactly what I needed and the customer service was excellent. Will definitely buy from this seller again.",
      "We're delighted you're happy with your purchase! Thank you for your kind words. We look forward to serving you again.",
      "2024-07-15",
    ],
    [
      "The product is okay, but the packaging was damaged upon arrival. The item itself was fine, but better packaging would be appreciated.",
      "We appreciate your feedback. We're sorry about the packaging issue and will improve our packaging process. Thank you for your understanding.",
      "2024-07-12",
    ],
    [
      "Great value for the price! The product exceeded my expectations and the delivery was prompt. Highly recommend this seller.",
      "Thank you for your positive review! We're glad the product met your expectations. We strive to provide excellent value and service.",
      "2024-07-10",
    ],
  ];

  // ✅ 셀 클릭 시 같은 핸들러로 행 모달 오픈
  const openRow = (review, reply, date) => {
    setSelectedRow({ review, reply, date });
  };

  return (
    <div className="page-root"  style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}>
      {/* Header */}
      <Header />
      <Homeback />

      {/* 스크롤 영역 */}
      <div className="content-scroll">
        <div className="container">
          <div className="greeting">
            <div className="greeting-text">
              <p className="hello-text">Hello, Yumin</p>
              <p className="hello-sub">Today is {dateText}</p>
            </div>
          </div>

          <h2 className="section-title with-icon">
            <span className="section-icon" aria-hidden="true">💬</span>
            Written Review Replies
          </h2>

          <div className="table-card">
            <div className="card-scroll">
              <table className="table-fixed">
                <colgroup>
                  <col />                          {/* Review */}
                  <col />                          {/* Reply */}
                  <col style={{ width: "140px" }} />{/* Date */}
                </colgroup>
                <thead>
                  <tr>
                    <th>Review Content</th>
                    <th>Merchant Reply</th>
                    <th className="th-right">Creation Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reviewRows.map(([review, reply, date], i) => {
                    // ✅ 셀 공통 렌더러 (미리보기 + 클릭→모달)
                    const CellBtn = ({ text, label }) => (
                      <button
                        type="button"
                        className="ellipsis-3 ellipsis-trigger cell-trigger"
                        onClick={() => openRow(review, reply, date)}
                        aria-label={`${label}: 모달로 전체 보기`}
                        title="Click to view full review & reply"
                      >
                        {text}
                      </button>
                    );
                    return (
                      <tr key={i}>
                        <td><CellBtn text={review} label="Review" /></td>
                        <td><CellBtn text={reply} label="Reply" /></td>
                        <td className="td-right">
                          <button
                            type="button"
                            className="date-trigger"
                            onClick={() => openRow(review, reply, date)}
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
            Generated Product Posts
          </h2>

          <div className="table-card">
            <div className="card-scroll">
              <table className="table-fixed">
                <colgroup>
                  <col />                           {/* Title */}
                  <col style={{ width: "140px" }} />/* Date */
                </colgroup>
                <thead>
                  <tr>
                    <th>Product Post Title</th>
                    <th className="th-right">Creation Date</th>
                  </tr>
                </thead>
                <tbody>
                  {productRows.map(([title, date], i) => (
                    <tr key={i}>
                      <td>
                        <button
                          type="button"
                          className="ellipsis-3 ellipsis-trigger cell-trigger"
                          onClick={() => setSelectedPost({ title, date })}
                          aria-label="Product title: view full"
                        >
                          {title}
                        </button>
                      </td>
                      <td className="td-right">
                        <button
                          type="button"
                          className="date-trigger"
                          onClick={() => setSelectedPost({ title, date })}
                          aria-label="Product date: view"
                        >
                          {date}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
 
          {/* ✅ 상품글 모달 */}
          <Modal
            open={!!selectedPost}
            onClose={() => setSelectedPost(null)}
            title="Product Post"
          >
            {selectedPost && (
              <div className="post-wrap">
                <div className="post-item">
                  <h4 className="post-label">Title</h4>
                  <div className="post-text">{selectedPost.title}</div>
                </div>
                <div className="post-meta">
                  Created on <strong>{selectedPost.date}</strong>
                </div>
              </div>
            )}
          </Modal>
          <footer className="footer">
            <p>© {new Date().getFullYear()} Orumi. All rights reserved.</p>
          </footer>
        </div>
      </div>

      {/* ✅ 행 단위 모달: 리뷰 + 응답 + 날짜 같이 표기 */}
      <Modal
        open={!!selectedRow}
        onClose={() => setSelectedRow(null)}
        title="Review & Reply"
      >
        {selectedRow && (
          <div className="rr-wrap">
            <div className="rr-item">
              <h4 className="rr-label">Review</h4>
              <div className="rr-text">{selectedRow.review}</div>
            </div>
            <div className="rr-item">
              <h4 className="rr-label">Reply</h4>
              <div className="rr-text">{selectedRow.reply}</div>
            </div>
            <div className="rr-meta">Created on <strong>{selectedRow.date}</strong></div>
          </div>
        )}
      </Modal>


      {/* ✅ 상품글 모달 */}
      <Modal
        open={!!selectedPost}
        onClose={() => setSelectedPost(null)}
        title="Product Post"
      >
        {selectedPost && (
          <div className="post-wrap">
            <div className="post-item">
              <h4 className="post-label">Title</h4>
              <div className="post-text">{selectedPost.title}</div>
            </div>
            <div className="post-meta">
              Created on <strong>{selectedPost.date}</strong>
            </div>
          </div>
        )}
      </Modal>

    </div>
  );
}
