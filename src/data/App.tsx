import { useState } from 'react'
import '../App.css'
import SearchBar from "../components/SearchBar.tsx";
import PeriodicTable from "../components/PeriodicTable";
import ElementDetail from "../components/ElementDetail.tsx";
import Header from "../components/Header.tsx";

import { elements } from "./elements.ts"

import type { Element } from "./types";

function App() {


    const [selectedElement, setSelectedElement] =
        useState<Element | null>(null);

    const [search, setSearch] = useState("");

    const filteredElements = elements.filter(
        (el) =>
            el.name
                .toLowerCase()
                .includes(search.toLowerCase()) ||
            el.symbol
                .toLowerCase()
                .includes(search.toLowerCase())
    );

    return (
        <>
            <Header />

            <SearchBar
                search={search}
                setSearch={setSearch}
            />

            <PeriodicTable
                elements={filteredElements}
                onSelect={setSelectedElement}
            />

            <ElementDetail
                element={selectedElement}
                onClose={() =>
                    setSelectedElement(null)
                }
            />
        </>
  )
}

export default App
