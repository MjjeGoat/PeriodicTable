export type Element = {
    atomicNumber: number;
    symbol: string;
    name: string;
    atomicMass: number;
    group: number;
    period: number;
    category: string;
    halfLife?: string;
};

export type ElementDetailProps = {
    element: Element | null;
};

export type ElementCellProps = {
    element: Element;
    onClick: (element: Element) => void;
};

export type SearchBarProps = {
    search: string;
    setSearch: (value: string) => void;
};