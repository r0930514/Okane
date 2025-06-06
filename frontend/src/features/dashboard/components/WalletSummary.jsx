import WalletIcon from './WalletIcon.jsx';
export default function WalletSummary() {
    return (
        <div className="container px-6 pt-6">
            {
                <div className="flex h-fit flex-wrap lg:flex-nowrap border border-black/20 rounded-3xl ">
                    <div className="flex h-24 w-full m-6 gap-6 items-center">
                        <div className='flex gap-6 w-fit'>
                            {WalletIcon()}
                            <div className="flex-col justify-start items-start gap-1 inline-flex">
                                <div className=" text-gray-700 text-base font-normal ">淨資產</div>
                                <div className=" text-gray-700 text-4xl font-semibold ">$52,000</div>
                            </div>
                        </div>
                    </div>
                    <div className="flex h-24 w-full m-6 justify-end items-center gap-4 overflow-scroll">
                        <div className='flex h-full w-fit border border-black/20 rounded-3xl'>
                            <div className='flex-col py-4 px-8 w-fit'>
                                <div className=" text-gray-700 text-base font-normal ">資產</div>
                                <div className=" text-teal-500 text-4xl font-semibold ">$8,400</div>
                            </div>
                        </div>
                        <div className='flex h-full w-fit border border-black/20 rounded-3xl'>
                            <div className='flex-col py-4 px-8 w-fit'>
                                <div className=" text-gray-700 text-base font-normal ">負債</div>
                                <div className=" text-pink-600 text-4xl font-semibold ">$3,000</div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}