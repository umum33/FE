import React from 'react';
import '../globals.css';
import { MainActions} from "./MainActions";
import Header from "../Header/Header";

export function Main (){

    return (
        <div
          className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
          style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
        >
          <div className="layout-container flex h-full grow flex-col">
            <Header />
           
             <div className="px-40 flex flex-1 justify-center py-5">
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
                          오름이와 함께 우리가게를 홍보해볼까요?
                        </h1>
                        <h2 className="text-white text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                          오름이는 온라인 홍보에 어려움을 겪는 전통시장 상인분들을 위한 AI 글쓰기 서비스입니다
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
                      Q.오름이는 어떤 서비스 인가요?
                    </h1>
                    <p className="text-[#8a7260] text-base font-normal leading-normal max-w-[720px]">
                     A.오름이는 음성인식 기반 AI 글쓰기 서비스로 온라인 홍보 전반에 도움을 드리고자 합니다
                    </p>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-0">
                    <div className="flex flex-1 gap-3 rounded-lg border border-[#e6dfdb] bg-white p-4 flex-col">
                      <div className="text-[#923522]" data-icon="MagicWand" data-size="24px" data-weight="regular">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                          <path
                            d="M48,64a8,8,0,0,1,8-8H72V40a8,8,0,0,1,16,0V56h16a8,8,0,0,1,0,16H88V88a8,8,0,0,1-16,0V72H56A8,8,0,0,1,48,64ZM184,192h-8v-8a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0v-8h8a8,8,0,0,0,0-16Zm56-48H224V128a8,8,0,0,0-16,0v16H192a8,8,0,0,0,0,16h16v16a8,8,0,0,0,16,0V160h16a8,8,0,0,0,0-16ZM219.31,80,80,219.31a16,16,0,0,1-22.62,0L36.68,198.63a16,16,0,0,1,0-22.63L176,36.69a16,16,0,0,1,22.63,0l20.68,20.68A16,16,0,0,1,219.31,80Zm-54.63,32L144,91.31l-96,96L68.68,208ZM208,68.69,187.31,48l-32,32L176,100.69Z"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex flex-col gap-1">
                        <h2 className="text-[#923522] text-base font-bold leading-tight">번거로운 글쓰기는 AI에게 맡기세요</h2>
                        <p className="text-[#8a7260] text-sm font-normal leading-normal">원하는 문구를 말하면 학습된 AI가 멋진 홍보글을 만들어드립니다.</p>
                      </div>
                    </div>
                    <div className="flex flex-1 gap-3 rounded-lg border border-[#e6dfdb] bg-white p-4 flex-col">
                      <div className="text-[#923522]" data-icon="ChatCircleDots" data-size="24px" data-weight="regular">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                          <path
                            d="M140,128a12,12,0,1,1-12-12A12,12,0,0,1,140,128ZM84,116a12,12,0,1,0,12,12A12,12,0,0,0,84,116Zm88,0a12,12,0,1,0,12,12A12,12,0,0,0,172,116Zm60,12A104,104,0,0,1,79.12,219.82L45.07,231.17a16,16,0,0,1-20.24-20.24l11.35-34.05A104,104,0,1,1,232,128Zm-16,0A88,88,0,1,0,51.81,172.06a8,8,0,0,1,.66,6.54L40,216,77.4,203.53a7.85,7.85,0,0,1,2.53-.42,8,8,0,0,1,4,1.08A88,88,0,0,0,216,128Z"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex flex-col gap-1">
                        <h2 className="text-[#923522] text-base font-bold leading-tight">깔끔한 리뷰관리</h2>
                        <p className="text-[#8a7260] text-sm font-normal leading-normal">음성인식을 이용해 마음을 담아 응답할 수 있습니다.</p>
                      </div>
                    </div>
                    <div className="flex flex-1 gap-3 rounded-lg border border-[#e6dfdb] bg-white p-4 flex-col">
                      <div className="text-[#923522]" data-icon="ClockCounterClockwise" data-size="24px" data-weight="regular">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                          <path
                            d="M136,80v43.47l36.12,21.67a8,8,0,0,1-8.24,13.72l-40-24A8,8,0,0,1,120,128V80a8,8,0,0,1,16,0Zm-8-48A95.44,95.44,0,0,0,60.08,60.15C52.81,67.51,46.35,74.59,40,82V64a8,8,0,0,0-16,0v40a8,8,0,0,0,8,8H72a8,8,0,0,0,0-16H49c7.15-8.42,14.27-16.35,22.39-24.57a80,80,0,1,1,1.66,114.75,8,8,0,1,0-11,11.64A96,96,0,1,0,128,32Z"
                          ></path>
                        </svg>
                      </div>
                      <div className="flex flex-col gap-1">
                        <h2 className="text-[#923522] text-base font-bold leading-tight">효율적인 시간관리</h2>
                        <p className="text-[#8a7260] text-sm font-normal leading-normal">온라인 스토어 관리에 긴 시간을 쏟지않아도 효율적으로 운영할 수 있습니다</p>
                      </div>
                    </div>
                  </div>
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
    
      );
    }