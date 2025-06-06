import { PropTypes } from "prop-types";
function FeatureCard({ icon: Icon, title, description, iconColor }) {
    return (
        <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="card-body text-center">
                <div className="flex justify-center mb-4">
                    <Icon size={48} className={iconColor} />
                </div>
                <h3 className="card-title justify-center text-lg">{title}</h3>
                <p className="text-gray-600">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default FeatureCard;

FeatureCard.propTypes = {
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    iconColor: PropTypes.string,
};
