"use client";

import { ReactFlowProvider } from "@xyflow/react";
import Consumer from "./Consumer";
import "@xyflow/react/dist/style.css";

const Home = () => {
    return (
        <ReactFlowProvider>
            <Consumer />
        </ReactFlowProvider>
    );
};

export default Home;