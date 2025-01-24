import {react} from "react"
import BugReportIcon from '@mui/icons-material/BugReport';

const CustomCursor = (props) => {
    return (
        <>
        <div className=" w-20 h-20 bg-[#5b55552c] rounded-full z-50 absolute  translate-x-[-50%] translate-y-[-50%] flex justify-center items-center" style={{top : `${props.y}px`, left : `${props.x}px`, pointerEvents : "none"}} >
            <BugReportIcon style={{backgroundColor: "#5b55552c", mixBlendMode: "difference", rotate : "320deg"}}/>
            </div>
        </>
    )
}
export default CustomCursor