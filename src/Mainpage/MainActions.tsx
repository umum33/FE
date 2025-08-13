import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FileText, MessageSquare, User, ChevronRight } from "lucide-react";

export function MainActions() {

  const navigate = useNavigate();

  const actions = [
    {
      icon: FileText,
      title: "상품 홍보글 만들기",
      description: "음성으로 상품을 설명하면\n멋진 홍보글을 만들어드려요",
      buttonText: "홍보글 생성하기",
      gradient: "from-orange-600 to-red-600",
      iconBg: "from-orange-100 to-red-100",
      path:"/result"
    },
    {
      icon: MessageSquare,
      title: "리뷰 답변 만들기", 
      description: "고객 리뷰에 대한\n정중한 답변을 작성해드려요",
      buttonText: "답변 생성하기",
      gradient: "from-yellow-600 to-orange-600",
      iconBg: "from-yellow-100 to-orange-100",
      path: "/review"
    },
    {
      icon: User,
      title: "내가 만든 글 보기",
      description: "지금까지 생성한 홍보글과\n리뷰답변을 모두 확인하세요",
      buttonText: "마이페이지 가기",
      gradient: "from-amber-600 to-yellow-600",
      iconBg: "from-amber-100 to-yellow-100",
      path : "/mypage"
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-800 to-red-700 bg-clip-text text-transparent mb-4">
            어떤 작업을 하시겠습니까?
          </h2>
          <p className="text-lg text-orange-700">
            원하는 기능을 선택해주세요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {actions.map((action, index) => (
            <Card key={index} className="group text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-100 bg-white">
              <CardHeader className="pb-4 pt-6">
                <div className={`w-20 h-20 bg-gradient-to-br ${action.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-all duration-300 shadow-md border border-white/50`}>
                  <action.icon className="w-10 h-10 text-orange-700" />
                </div>
                <CardTitle className="text-xl font-bold text-orange-900 mb-3">{action.title}</CardTitle>
                <p className="text-orange-700 leading-relaxed whitespace-pre-line text-sm">
                  {action.description}
                </p>
              </CardHeader>
              
              <CardContent className="pt-2 pb-6">
                <Button
                onClick={() => action.path && navigate(action.path)}
                className={`w-full bg-gradient-to-r ${action.gradient} hover:shadow-lg text-white py-3 px-4 font-medium flex items-center justify-center space-x-2 transition-all duration-300 rounded-lg border-0`}>
                  <span>{action.buttonText}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}