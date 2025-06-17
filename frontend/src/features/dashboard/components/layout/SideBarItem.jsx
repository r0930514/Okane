import PropTypes from "prop-types"

export default function SideBarItem({ icon, text, isFocused, onClick }) {
    return (
        <li>
            <button 
                className={`btn btn-ghost w-full justify-start gap-4 ${
                    isFocused ? 'btn-active bg-primary! text-primary-content!' : ''
                }`}
                onClick={onClick}
            >
                {icon}
                <span className="text-base font-medium">{text}</span>
            </button>
        </li>
    )
}

SideBarItem.propTypes = {
    icon: PropTypes.element.isRequired,
    text: PropTypes.string.isRequired,
    isFocused: PropTypes.bool,
    onClick: PropTypes.func,
}
