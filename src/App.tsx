import { Routes, Route } from "react-router-dom";
import  {Main} from "../src/Mainpage/Main";
import  ReviewPage  from "../src/Reviewpage/ReviewPage";
import  Mypage from "../src/Mypage/Mypage";
import Product from "../src/Product/Product";
import Guidline from "../src/Guidline/Guidline";
import Naver from "../src/Guidline/Naver";
import Coupang from "../src/Guidline/Coupang";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />}/>
      <Route path="/result" element={<Product />} />
      <Route path="/review" element={<ReviewPage />} />
      <Route path="/mypage" element={<Mypage />}/>
      <Route path="/guidline" element={<Guidline />}/>
      <Route path="/Naver" element={<Naver />}/>
      <Route path="/Coupang" element={<Coupang />}/>

    </Routes>
  );
}