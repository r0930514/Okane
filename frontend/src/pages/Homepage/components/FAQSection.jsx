export default function FAQSection() {
    return (
        <div>
            {/* Help Center / FAQ Section */}
            <div id="help" className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">常見問題</h2>
                    <p className="text-xl text-gray-600">快速找到您需要的答案</p>
                </div>
                <div className="max-w-4xl mx-auto space-y-4">
                    <div className="collapse collapse-plus bg-white shadow-lg">
                        <input type="radio" name="faq-accordion" defaultChecked />
                        <div className="collapse-title text-xl font-medium">
              Okane 支援哪些資產類型？
                        </div>
                        <div className="collapse-content">
                            <p>我們支援現金、股票、加密貨幣、基金、債券等多種資產類型，並持續擴充新的資產支援。</p>
                        </div>
                    </div>
                    <div className="collapse collapse-plus bg-white shadow-lg">
                        <input type="radio" name="faq-accordion" />
                        <div className="collapse-title text-xl font-medium">
              如何開始使用分帳功能？
                        </div>
                        <div className="collapse-content">
                            <p>只需邀請朋友加入您的分帳群組，輸入共同支出，系統會自動計算每個人應付的金額。</p>
                        </div>
                    </div>
                    <div className="collapse collapse-plus bg-white shadow-lg">
                        <input type="radio" name="faq-accordion" />
                        <div className="collapse-title text-xl font-medium">
              資料安全性如何保障？
                        </div>
                        <div className="collapse-content">
                            <p>我們採用銀行級別的加密技術，所有資料都經過多層加密保護，絕不與第三方分享您的個人資訊。</p>
                        </div>
                    </div>
                    <div className="collapse collapse-plus bg-white shadow-lg">
                        <input type="radio" name="faq-accordion" />
                        <div className="collapse-title text-xl font-medium">
              是否提供手機應用程式？
                        </div>
                        <div className="collapse-content">
                            <p>目前提供響應式網頁版本，支援所有裝置使用。手機應用程式正在開發中，敬請期待。</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}            
