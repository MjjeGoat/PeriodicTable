import type { Element } from "../data/types";
import ElementCell from "./ElementCell";

type Props = {
    elements: Element[];
    onSelect: (element: Element) => void;
};

const PeriodicTable = ({ elements, onSelect }: Props) => {
    return (
        <div>
            {elements.map((el) => (
                <ElementCell
                    key={el.atomicNumber}
                    element={el}
                    onClick={onSelect}
                />
            ))}
        </div>
    );
};

export default PeriodicTable;