import PropTypes from "prop-types"

export default function NavBarItem({ icon, text, isFocused }) {
    let isFocusedClass = isFocused ? "focus" : ""
    return (
        <li className="flex h-11">
            <div className={`${isFocusedClass} gap-4`}>
                {icon}
                <p className="text-base">{text}</p>
            </div>
        </li>
    )
}

NavBarItem.propTypes = {
    icon: PropTypes.element.isRequired,
    text: PropTypes.string.isRequired,
    isFocused: PropTypes.bool,
}