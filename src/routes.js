import React from "react";
import { Routes, Route } from 'react-router-dom';
import Home from "./App.js";
import SuccessPage from "./pages/SuccessPage";

function Router() {
    return (
        <Routes>
            <Route exact path="/" element={<Home/>}/>
            <Route exact path="/about" element={<SuccessPage/>}/>
        </Routes>
    );
};

export default Router;