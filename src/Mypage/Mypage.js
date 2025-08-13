import React from "react";
import "./Mypage.css";

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
    <div className="page-root">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <div className="logo-icon" aria-hidden="true">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z" fill="currentColor" />
              <path fillRule="evenodd" clipRule="evenodd" d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z" fill="currentColor" />
            </svg>
          </div>
          <h1 className="brand-title">Orumi</h1>
        </div>
      </header>

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
