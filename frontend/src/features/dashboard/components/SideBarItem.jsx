import PropTypes from "prop-types"

export default function SideBarItem({ icon, text, isFocused, onClick }) {
    return (
        <li>
            <button 
                className={`flex items-center gap-4 p-3 rounded-lg w-full text-left transition-colors duration-200 hover:bg-base-200 ${
                    isFocused ? 'bg-primary text-primary-content' : 'text-base-content'
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
