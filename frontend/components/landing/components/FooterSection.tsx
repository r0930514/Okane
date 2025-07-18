import { Github } from 'lucide-react';

export default function FooterSection() {
    return (
        <footer className="bg-gray-100 text-gray-700 py-8 border-t border-gray-200">
            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row justify-between items-center">
                    <p className="mb-4 sm:mb-0">
                        © 2025 Okane. 讓資產管理變得更簡單。
                    </p>
                    <a
                        href="https://github.com/r0930514/Okane/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 hover:text-gray-900 transition-colors duration-200"
                    >
                        <Github size={20} />
                        <span>查看原始碼</span>
                    </a>
                </div>
            </div>
        </footer>
    );
}