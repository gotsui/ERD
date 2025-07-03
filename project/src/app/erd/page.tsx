"use client";

import { ReactFlowProvider } from "@xyflow/react";
import ErdEditor from "./ErdEditor";
import "@xyflow/react/dist/style.css";

const Home = () => {
    return (
        <ReactFlowProvider>
            <ErdEditor />
        </ReactFlowProvider>
    );
};

export default Home;