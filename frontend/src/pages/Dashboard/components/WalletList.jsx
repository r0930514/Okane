import { CaretRight } from "@phosphor-icons/react";
import WalletListCard from "./WalletListCard";

export default function WalletList() {
    return (
        <div className="flex flex-col w-full h-full overflow-scroll px-6 py-3 gap-3">
            <div className="flex flex-col py-3 gap-3 w-full">
                <div className="flex items-center h-12 gap-2">
                    <div className="text-start justify-start text-2xl font-semibold to-base-content">手動帳戶</div>
                    <CaretRight size={24} />
                </div>
                <div className="flex gap-6 overflow-scroll">
                    <WalletListCard name="現金" balance={12400} color="green" />
                    <WalletListCard name="銀行" balance={12400} color="blue" />
                </div>
            </div>
            <div className="flex flex-col py-3 gap-3 w-full">
                <div className="flex items-center h-12 gap-2">
                    <div className="text-start justify-start text-2xl font-semibold to-base-content">同步帳戶</div>
                    <CaretRight size={24} />
                </div>
                <div className="flex gap-6 overflow-scroll">
                    <WalletListCard name="現金" balance={12400} color="green" />
                    <WalletListCard name="銀行" balance={12400} color="blue" />
                </div>
            </div>
            <div className="flex flex-col py-3 gap-3 w-full">
                <div className="flex items-center h-12 gap-2">
                    <div className="text-start justify-start text-2xl font-semibold to-base-content">同步帳戶</div>
                    <CaretRight size={24} />
                </div>
                <div className="flex gap-6 overflow-scroll">
                    <WalletListCard name="現金" balance={12400} color="green" />
                    <WalletListCard name="銀行" balance={12400} color="blue" />
                </div>
            </div>
        </div>
    )
}
