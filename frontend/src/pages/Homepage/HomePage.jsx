import { Link } from "react-router-dom";
import {
  CurrencyDollar,
  Users,
  CurrencyCircleDollar,
  Plug,
  ChartPie,
  TrendUp,
  PencilSimple,
  ClipboardText,
  Lock,
  GithubLogo
} from "@phosphor-icons/react";
import FeatureCard from "./components/FeatureCard";

function HomePage() {
  const features = [
    {
      icon: CurrencyDollar,
      title: "多種資產類型",
      description: "支持現金、加密貨幣、股票等多種資產類型管理",
      iconColor: "text-blue-600"
    },
    {
      icon: Users,
      title: "朋友分帳",
      description: "與朋友輕鬆分帳，智能記錄應收付帳款，理財更社交",
      iconColor: "text-green-600"
    },
    {
      icon: CurrencyCircleDollar,
      title: "自訂匯率轉換",
      description: "選擇不同供應商的匯率，獲得最精準的資產價值計算",
      iconColor: "text-purple-600"
    },
    {
      icon: Plug,
      title: "模組化錢包",
      description: "連接外部服務，打造專屬的錢包管理模組",
      iconColor: "text-orange-600"
    },
    {
      icon: ChartPie,
      title: "智能分類",
      description: "自動分類管理，讓您的資產組織更有條理",
      iconColor: "text-indigo-600"
    },
    {
      icon: TrendUp,
      title: "資產總值計算",
      description: "即時計算資產總值，掌握財務狀況",
      iconColor: "text-emerald-600"
    },
    {
      icon: PencilSimple,
      title: "靈活管理",
      description: "輕鬆新增、編輯和刪除資產，操作簡單直觀",
      iconColor: "text-amber-600"
    },
    {
      icon: ClipboardText,
      title: "專業報告",
      description: "生成詳細報告，分析資產分佈和變化趨勢",
      iconColor: "text-teal-600"
    },
    {
      icon: Lock,
      title: "安全可靠",
      description: "採用安全的身份驗證，保護您的財務隱私",
      iconColor: "text-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-200 to-indigo-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-gray-800 mb-6">
            <span className="text-blue-600">O</span>kane
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            輕鬆管理和追蹤您的資產，讓理財變得更簡單直觀
          </p>
          <Link to={'/login'}>
            <button className="btn btn-primary btn-lg px-8 py-3 text-lg">
              立即開始
            </button>
          </Link>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              iconColor={feature.iconColor}
            />
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl shadow-xl p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            準備好開始管理您的資產了嗎？
          </h2>
          <p className="text-gray-600 mb-8 text-lg">
            加入 Okane，體驗全新的資產管理方式
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={'/login'}>
              <button className="btn btn-primary btn-lg px-8">
                登入｜註冊
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 mb-4 sm:mb-0">
              © 2025 Okane. 讓資產管理變得更簡單。
            </p>
            <a
              href="https://github.com/r0930514/Okane/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              <GithubLogo size={20} />
              <span>查看原始碼</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage;