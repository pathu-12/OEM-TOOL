import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import EquipmentConfiguration from "./pages/equipmentConfiguration";
import EquipmentDocs from "./pages/equipmentDocs";
import MaintainanceAllocation from "./pages/maintainanceAllocation";
import Home from "./pages/home";
import EquipmentData from "./pages/equipmentData";
const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/equipment_configuration" element={<EquipmentConfiguration />} />
                <Route path="/equipment_docs" element={<EquipmentDocs />} />
                <Route path="/maintainance_allocation" element={<MaintainanceAllocation />} />
                <Route path="/x" element={<EquipmentData />} />
            </Routes>
        </>
    )
}

export default App;