import React from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Store, Package } from "lucide-react";
import "./Guidline.css";
import Homeback from "../Homeback/Homeback";
import Header from "../Header/Header";

export default function Guidline() {
  const navigate = useNavigate();

  const registrationStores = [
    {
      icon: Store,
      title: "쿠팡",
      description: "쿠팡에 상품을 등록하는\n방법을 알려드려요",
      buttonText: "쿠팡 등록 방법 보기",
      path: "/Coupang",
      iconBg: "bg-[#f0f2f5]",
      buttonBg: "bg-[#f0f2f5]",
      textColor: "text-[#111418]",
    },
    {
      icon: Package,
      title: "네이버 스마트스토어",
      description: "스마트스토어에 상품을\n등록하는 방법을 알려드려요",
      buttonText: "스마트스토어 등록 방법 보기",
      path: "/Naver",
      iconBg: "bg-[#f0f2f5]",
      buttonBg: "bg-[#f0f2f5]",
      textColor: "text-[#111418]",
    },
  ];

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <Header />
      <Homeback />
      <div className="layout-container flex h-full grow flex-col">
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-center text-center gap-3 p-4">
              <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight min-w-72">
                스토어별 상품 등록 방법
              </p>
            </div>
            <div className="flex flex-wrap justify-center text-center gap-3 p-4">
              <p className="text-[#c46f2d] tracking-light text-[17px] font-normal  leading-tight min-w-72">
                온라인 스토어의 회원가입 및 기본 설정 완료 후 참고하실 것을 권고드립니다
              </p>
            </div>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 p-4">
              {registrationStores.map((store, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-xl w-full max-w-[400px]`}
                >
                  <div className={`text-[#111418] flex items-center justify-center rounded-lg ${store.iconBg} shrink-0 size-16`}>
                    <store.icon className="w-8 h-8" />
                  </div>
                  <p className={`text-xl font-bold leading-normal text-center mt-2 ${store.textColor}`}>
                    {store.title}
                  </p>
                  <p className="text-[#60758a] text-sm font-normal leading-normal text-center whitespace-pre-line">
                    {store.description}
                  </p>
                  <button
                    onClick={() => store.path && navigate(store.path)}
                    className={`mt-4 flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 ${store.buttonBg} ${store.textColor} text-sm font-medium leading-normal w-fit`}
                  >
                    <span className="truncate">{store.buttonText}</span>
                  </button>
                </div>
              ))}
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
  );
}