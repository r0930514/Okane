import {
    GithubLogo
} from "@phosphor-icons/react";
export default function FooterSection() {
    return <>
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
    </>
}