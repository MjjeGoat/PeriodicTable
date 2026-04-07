import type { ElementCellProps } from "../data/types";

const ElementCell = ({ element, onClick }: ElementCellProps) => {
    return (
        <div onClick={() => onClick(element)}>
            <strong>{element.symbol}</strong>
            <div>{element.atomicNumber}</div>
        </div>
    );
};

export default ElementCell;