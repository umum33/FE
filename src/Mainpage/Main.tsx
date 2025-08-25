import React from 'react';
import '../globals.css';
import { MainActions } from "./MainActions";
import Header from "../Header/Header";

export function Main() {
  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
    >
      <div className="layout-container flex h-full grow flex-col gap-10">
        <Header />
        <div className="px-4 sm:px-6 flex flex-1 justify-center">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="@container">
              <div className="@[480px]:p-4">
                <div
                  className="flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-lg items-start justify-end px-4 pb-10 @[480px]:px-10"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://visitgangnam.net/wp-content/uploads/2022/08/2-%E1%84%8B%E1%85%A7%E1%86%BC%E1%84%83%E1%85%A9%E1%86%BC%E1%84%8C%E1%85%A5%E1%86%AB%E1%84%90%E1%85%A9%E1%86%BC%E1%84%89%E1%85%B5%E1%84%8C%E1%85%A1%E1%86%BC-1.jpg")',
                  }}
                >
                  <div className="flex flex-col gap-2 text-left">
                    <h1
                      className="text-white text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]"
                    >
                      오름이와 함께 <br></br>우리가게를 홍보해볼까요?
                    </h1>
                    <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                      글쓰기부터 온라인 판매까지, 사장님의 모든 어려움을 AI 파트너 오름이가 해결합니다.
                    </h2>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-10 px-4 py-10 @container">
              <div className="flex flex-col gap-4">
                <h1
                  className="text-[#923522] tracking-light text-[32px] font-bold leading-tight @[480px]:text-4xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em] max-w-[720px]"
                >
                  Q. 오름이는 어떤 서비스 인가요?
                </h1>
                <p className="text-[#8a7260] text-base font-normal leading-normal max-w-[720px]">
                  A. 오름이는 글쓰기와 온라인 홍보에 어려움을 겪는 사장님들을 위한 AI 글쓰기 파트너입니다.
                </p>
              </div>
            </div>
          </div>
        </div>
        <MainActions />
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