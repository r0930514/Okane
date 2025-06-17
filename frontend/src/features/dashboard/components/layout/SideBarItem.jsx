import PropTypes from "prop-types"

export default function SideBarItem({ icon, text, isFocused, onClick }) {
    return (
        <li>
            <a 
                className={`text-base ${isFocused ? 'menu-focus' : ''}`}
                onClick={(e) => {
                    e.preventDefault()
                    onClick()
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onClick()
                    }
                }}
            >
                {icon}
                {text}
            </a>
        </li>
    )
}

SideBarItem.propTypes = {
    icon: PropTypes.element.isRequired,
    text: PropTypes.string.isRequired,
    isFocused: PropTypes.bool,
    onClick: PropTypes.func,
}
