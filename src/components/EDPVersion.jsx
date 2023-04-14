
import { useState } from "react";
import "./EDPVersion.css"

export default function EDPVersion({ currentEDPVersion }) {

    return (
       <div id="edp-version">
           v{currentEDPVersion}
       </div> 
    )
}