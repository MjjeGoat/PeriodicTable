import type { ElementDetailProps } from "../data/types";

const ElementDetail = ({ element }: ElementDetailProps) => {
    if (!element) {
        return <div>Select an element</div>;
    }

    return (
        <div>
            <h2>{element.name}</h2>

            <p>
                <strong>Atomic Number:</strong>
                {element.atomicNumber}
            </p>

            <p>
                <strong>Atomic Mass:</strong>
                {element.atomicMass}
            </p>

            <p>
                <strong>Group:</strong>
                {element.group}
            </p>

            <p>
                <strong>Category:</strong>
                {element.category}
            </p>

            {element.halfLife && (
                <p>
                    <strong>Half-life:</strong>
                    {element.halfLife}
                </p>
            )}
        </div>
    );
};

export default ElementDetail;