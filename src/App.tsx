import { Routes, Route } from "react-router-dom";
import { MainActions } from "../src/Mainpage/MainActions";
import { Main } from "../src/Mainpage/Main";
import  ReviewPage  from "../src/Reviewpage/ReviewPage";
import  Mypage from "../src/Mypage/Mypage";
import Product from "../src/Product/Product";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />}/>
      <Route path="/result" element={<Product />} />
      <Route path="/review" element={<ReviewPage />} />
      <Route path="/mypage" element={<Mypage />}/>

    </Routes>
  );
}