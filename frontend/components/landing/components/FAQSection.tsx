"use client";

import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

export default function FAQSection() {
    const [openItem, setOpenItem] = useState<string | null>("faq-1");

    const faqs = [
        {
            id: "faq-1",
            question: "Okane 支援哪些資產類型？",
            answer: "我們支援現金、股票、加密貨幣、基金、債券等多種資產類型，並持續擴充新的資產支援。"
        },
        {
            id: "faq-2",
            question: "如何開始使用分帳功能？",
            answer: "只需邀請朋友加入您的分帳群組，輸入共同支出，系統會自動計算每個人應付的金額。"
        },
        {
            id: "faq-3",
            question: "資料安全性如何保障？",
            answer: "我們採用銀行級別的加密技術，所有資料都經過多層加密保護，絕不與第三方分享您的個人資訊。"
        },
        {
            id: "faq-4",
            question: "是否提供手機應用程式？",
            answer: "目前提供響應式網頁版本，支援所有裝置使用。手機應用程式正在開發中，敬請期待。"
        }
    ];

    return (
        <div>
            {/* Help Center / FAQ Section */}
            <div id="help" className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">常見問題</h2>
                    <p className="text-xl text-gray-600">快速找到您需要的答案</p>
                </div>
                <div className="max-w-4xl mx-auto space-y-4">
                    {faqs.map((faq) => (
                        <Collapsible
                            key={faq.id}
                            open={openItem === faq.id}
                            onOpenChange={(isOpen) => setOpenItem(isOpen ? faq.id : null)}
                            className="bg-white shadow-lg rounded-lg border border-gray-200"
                        >
                            <CollapsibleTrigger className="flex w-full items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors duration-200">
                                <span className="text-xl font-medium text-gray-800">{faq.question}</span>
                                <ChevronDown 
                                    className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                                        openItem === faq.id ? 'rotate-180' : ''
                                    }`} 
                                />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="px-6 pb-6">
                                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                            </CollapsibleContent>
                        </Collapsible>
                    ))}
                </div>
            </div>
        </div>
    );
}