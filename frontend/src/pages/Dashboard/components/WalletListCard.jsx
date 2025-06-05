import PropTypes from "prop-types"

export default function WalletListCard({ name, balance, color = "green" }) {
    return (
        <div className={`px-8 py-4 bg-${color}-500/20 rounded-2xl border border-b-gray-200  inline-flex flex-col justify-center items-start gap-4`}>
            <div className="inline-flex justify-start items-center gap-4">
                <div className="inline-flex flex-col justify-start items-start gap-1">
                    <div className="opacity-80 justify-start text-neutral text-base font-normal font-['Roboto'] leading-normal">
                        {name}
                    </div>
                    <div className="justify-start text-3xl font-semibold leading-10">
            ${balance}
                    </div>
                </div>
            </div>
        </div>
    )
}

WalletListCard.propTypes = {
    color: PropTypes.string,
    name: PropTypes.string,
    balance: PropTypes.number,
}
